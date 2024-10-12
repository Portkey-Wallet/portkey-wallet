import im, { ChannelStatusEnum, ChannelTypeEnum, IMStatusEnum, SocketMessage } from '@portkey-wallet/im';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useAppCASelector } from '../.';
import { AElfWallet } from '@portkey-wallet/types/aelf';
import { useCurrentNetworkInfo } from '../network';
import { useAppCommonDispatch } from '../../index';
import {
  addChannel,
  setRelationId,
  setRelationToken,
  updateChannelAttribute,
} from '@portkey-wallet/store/store-ca/im/actions';
import { UpdateChannelAttributeTypeEnum } from '@portkey-wallet/store/store-ca/im/type';
import { useEditContact } from '../contact';
import { EditContactItemApiType } from '@portkey-wallet/types/types-ca/contact';
import { useChannelList } from './channelList';
import { fetchContactListAsync } from '@portkey-wallet/store/store-ca/contact/actions';
import { request } from '@portkey-wallet/api/api-did';
import useLockCallback from '../../useLockCallback';
import { handleLoopFetch } from '@portkey-wallet/utils';
import { messageContentParser } from '@portkey-wallet/im/utils';

export const useIMState = () => useAppCASelector(state => state.im);
export const useIMHasNextNetMapState = () => useAppCASelector(state => state.im.hasNextNetMap);
export const useIMChannelListNetMapState = () => useAppCASelector(state => state.im.channelListNetMap);
export const useIMChannelMessageListNetMapState = () => useAppCASelector(state => state.im.channelMessageListNetMap);
export const useIMRelationIdNetMapNetMapState = () => useAppCASelector(state => state.im.relationIdNetMap);
export const useIMRelationTokenNetMapNetMapState = () => useAppCASelector(state => state.im.relationTokenNetMap);
export const useIMGroupInfoMapNetMapState = () => useAppCASelector(state => state.im.groupInfoMapNetMap);
export const useRedPackageConfigMapState = () => useAppCASelector(state => state.im.redPackageConfigMap);
export const useIMPinListNetMapState = () => useAppCASelector(state => state.im.pinListNetMap);
export const useIMLastPinNetMapState = () => useAppCASelector(state => state.im.lastPinNetMap);

export const useUnreadCount = () => {
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const { unreadCount } = im.getMessageCount();
    setUnreadCount(unreadCount);

    const { remove } = im.registerMessageCountObserver(e => {
      setUnreadCount(e.unreadCount);
    });

    return remove;
  }, []);

  return unreadCount;
};

export const useRelationId = () => {
  const dispatch = useAppCommonDispatch();
  const { networkType } = useCurrentNetworkInfo();
  const relationIdNetMap = useIMRelationIdNetMapNetMapState();

  const relationId = useMemo(() => relationIdNetMap?.[networkType], [networkType, relationIdNetMap]);

  const getRelationId = useCallback(async () => {
    const { data: userInfo } = await im.service.getUserInfo();
    if (userInfo?.relationId) {
      dispatch(
        setRelationId({
          network: networkType,
          relationId: userInfo.relationId,
        }),
      );

      return userInfo.relationId;
    }
    throw new Error('can not get im info');
  }, [dispatch, networkType]);

  return {
    relationId,
    getRelationId,
  };
};
let observersList: { remove: () => void }[] = [];
export const useInitIM = () => {
  const { networkType } = useCurrentNetworkInfo();
  const dispatch = useAppCommonDispatch();
  const { getRelationId } = useRelationId();
  const channelListNetMap = useIMChannelListNetMapState();
  const list = useMemo(() => channelListNetMap?.[networkType]?.list || [], [channelListNetMap, networkType]);
  const listRef = useRef(list);
  listRef.current = list;

  const relationTokenNetMap = useIMRelationTokenNetMapNetMapState();
  const relationToken = useMemo(() => relationTokenNetMap?.[networkType], [networkType, relationTokenNetMap]);

  const unreadMessageUpdate = useCallback(
    async (e: any) => {
      const rawMsg: SocketMessage = e['im-message'];

      if (!listRef.current.find(item => item.channelUuid === rawMsg.channelUuid)) {
        console.log('addChannel', rawMsg.channelUuid);

        if (rawMsg.channelType === ChannelTypeEnum.P2P) {
          dispatch(
            addChannel({
              network: networkType,
              channel: {
                status: ChannelStatusEnum.NORMAL,
                channelUuid: rawMsg.channelUuid,
                displayName: rawMsg.fromName || '',
                channelIcon: rawMsg.fromAvatar || '',
                channelType: rawMsg.channelType,
                unreadMessageCount: 1,
                mentionsCount: 0,
                lastMessageType: rawMsg.type,
                lastMessageContent: messageContentParser(rawMsg.type, rawMsg.content),
                lastPostAt: rawMsg.createAt,
                mute: rawMsg.mute,
                pin: false,
                pinAt: '',
                toRelationId: rawMsg.from,
              },
            }),
          );
          return;
        }

        try {
          const {
            data: { list },
          } = await im.service.getChannelList({
            channelUuid: rawMsg.channelUuid,
          });
          if (list.length) {
            const channelInfoResult = list[0];
            const channelInfo = {
              ...channelInfoResult,
              lastMessageContent: messageContentParser(
                channelInfoResult.lastMessageType,
                channelInfoResult.lastMessageContent || '',
              ),
            };
            dispatch(
              addChannel({
                network: networkType,
                channel: channelInfo,
              }),
            );
          } else {
            const { data: channelInfo } = await im.service.getChannelInfo({
              channelUuid: rawMsg.channelUuid,
            });
            dispatch(
              addChannel({
                network: networkType,
                channel: {
                  status: ChannelStatusEnum.NORMAL,
                  channelUuid: rawMsg.channelUuid,
                  displayName: channelInfo.name,
                  channelIcon: rawMsg.fromAvatar || '',
                  channelType: rawMsg.channelType,
                  unreadMessageCount: 1,
                  mentionsCount: 0,
                  lastMessageType: rawMsg.type,
                  lastMessageContent: messageContentParser(rawMsg.type, rawMsg.content),
                  lastPostAt: rawMsg.createAt,
                  mute: rawMsg.mute,
                  pin: channelInfo.pin,
                  pinAt: '',
                  toRelationId: '',
                },
              }),
            );
          }
        } catch (error) {
          console.log('UnreadMsg addChannel error:', error);
        }
      } else {
        dispatch(
          updateChannelAttribute({
            network: networkType,
            channelId: rawMsg.channelUuid,
            value: {
              lastMessageType: rawMsg.type,
              lastMessageContent: messageContentParser(rawMsg.type, rawMsg.content),
              lastPostAt: rawMsg.createAt,
            },
            type: UpdateChannelAttributeTypeEnum.UPDATE_UNREAD_CHANNEL,
          }),
        );
      }
    },
    [dispatch, networkType],
  );
  const unreadMessageUpdateRef = useRef(unreadMessageUpdate);
  unreadMessageUpdateRef.current = unreadMessageUpdate;

  const setTokenUpdate = useCallback(
    (token: string) => {
      console.log('setRelationToken', token);
      dispatch(
        setRelationToken({
          network: networkType,
          token,
        }),
      );
    },
    [dispatch, networkType],
  );
  const setTokenUpdateRef = useRef(setTokenUpdate);
  setTokenUpdateRef.current = setTokenUpdate;

  const initIm = useLockCallback(
    async (account: AElfWallet, caHash: string) => {
      if (observersList.length) {
        observersList.forEach(item => {
          item.remove();
        });
        observersList = [];
      }

      observersList.push(
        im.registerUnreadMsgObservers(async (e: any) => {
          unreadMessageUpdateRef.current(e);
        }),
      );
      observersList.push(
        im.registerTokenObserver(async (e: string) => {
          setTokenUpdateRef.current(e);
        }),
      );

      if (![IMStatusEnum.INIT, IMStatusEnum.DESTROY].includes(im.status)) return;

      await im.init(account, caHash, relationToken);
      dispatch(fetchContactListAsync());

      await request.es.getCaHolder({
        params: {
          filter: `caHash: ${caHash}`,
        },
      });

      handleLoopFetch({
        fetch: getRelationId,
        times: 3,
      }).catch(error => {
        console.log('initIm getRelationId error', error);
      });
    },
    [dispatch, networkType, relationToken],
  );
  return initIm;
};

export const useIsIMReady = () => {
  return [IMStatusEnum.AUTHORIZED, IMStatusEnum.CONNECTED].includes(im.status);
};

export const useEditIMContact = () => {
  const { networkType } = useCurrentNetworkInfo();
  const dispatch = useAppCommonDispatch();
  const editContact = useEditContact();
  const { rawList } = useChannelList();
  const rawListRef = useRef(rawList);
  rawListRef.current = rawList;

  return useCallback(
    async (params: EditContactItemApiType) => {
      const result = await editContact(params);
      const channel = rawListRef.current.find(item => item.toRelationId === params.relationId);
      if (channel) {
        dispatch(
          updateChannelAttribute({
            network: networkType,
            channelId: channel.channelUuid,
            value: {
              displayName: result.name || result.caHolderInfo?.walletName || result.imInfo?.name || '',
            },
          }),
        );
      }
      return result;
    },
    [dispatch, editContact, networkType],
  );
};

export * from './channelList';
export * from './channel';
export * from './group';
export * from './redPackage';

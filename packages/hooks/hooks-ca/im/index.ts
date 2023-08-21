import im, { ChannelStatusEnum, ChannelTypeEnum, SocketMessage } from '@portkey-wallet/im';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useAppCASelector } from '../.';
import { AElfWallet } from '@portkey-wallet/types/aelf';
import { useCurrentNetworkInfo } from '../network';
import { useAppCommonDispatch } from '../../index';
import { addChannel, setRelationId, updateChannelAttribute } from '@portkey-wallet/store/store-ca/im/actions';
import { UpdateChannelAttributeTypeEnum } from '@portkey-wallet/store/store-ca/im/type';

export const useIMState = () => useAppCASelector(state => state.im);
export const useIMHasNextNetMapState = () => useAppCASelector(state => state.im.hasNextNetMap);
export const useIMChannelListNetMapState = () => useAppCASelector(state => state.im.channelListNetMap);
export const useIMChannelMessageListNetMapState = () => useAppCASelector(state => state.im.channelMessageListNetMap);
export const useIMRelationIdNetMapNetMapState = () => useAppCASelector(state => state.im.relationIdNetMap);

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

export const useInitIM = () => {
  const { networkType } = useCurrentNetworkInfo();
  const dispatch = useAppCommonDispatch();

  const isInitRef = useRef(false);

  const channelListNetMap = useIMChannelListNetMapState();
  const list = useMemo(() => channelListNetMap?.[networkType]?.list || [], [channelListNetMap, networkType]);
  const listRef = useRef(list);
  listRef.current = list;

  const unreadMessageUpdate = useCallback(
    async (e: any) => {
      const rawMsg: SocketMessage = e['im-message'];

      if (!listRef.current.find(item => item.channelUuid === rawMsg.channelUuid)) {
        console.log('addChannel', rawMsg.channelUuid);
        dispatch(
          addChannel({
            network: networkType,
            channel: {
              status: ChannelStatusEnum.NORMAL,
              channelUuid: rawMsg.channelUuid,
              displayName: rawMsg.fromName || '',
              channelIcon: rawMsg.fromAvatar || '',
              channelType: ChannelTypeEnum.P2P,
              unreadMessageCount: 1,
              mentionsCount: 0,
              lastMessageType: rawMsg.type,
              lastMessageContent: rawMsg.content,
              lastPostAt: rawMsg.createAt,
              mute: rawMsg.mute,
              pin: false,
              toRelationId: rawMsg.from,
            },
          }),
        );

        try {
          const { data: channelInfo } = await im.service.getChannelInfo({
            channelUuid: rawMsg.channelUuid,
          });
          console.log('channelInfo', channelInfo);

          dispatch(
            updateChannelAttribute({
              network: networkType,
              channelId: rawMsg.channelUuid,
              value: {
                pin: channelInfo.pin,
                channelType: channelInfo.type,
              },
            }),
          );
        } catch (error) {
          console.log('UnreadMsg addChannel error:', error);
        }
      } else {
        console.log('updateUnreadChannel');
        dispatch(
          updateChannelAttribute({
            network: networkType,
            channelId: rawMsg.channelUuid,
            value: {
              lastMessageType: rawMsg.type,
              lastMessageContent: rawMsg.content,
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

  const initIm = useCallback(
    async (account: AElfWallet, caHash: string) => {
      if (isInitRef.current) return;
      isInitRef.current = true;
      const result = await im.init(account, caHash);

      if (result?.relationId) {
        dispatch(
          setRelationId({
            network: networkType,
            relationId: result.relationId,
          }),
        );
      }

      im.registerUnreadMsgObservers(async (e: any) => {
        unreadMessageUpdateRef.current(e);
      });

      isInitRef.current = false;
      return result;
    },
    [dispatch, networkType],
  );
  return initIm;
};

export const useRelationId = () => {
  const { networkType } = useCurrentNetworkInfo();
  const relationIdNetMap = useIMRelationIdNetMapNetMapState();

  return useMemo(() => relationIdNetMap?.[networkType], [networkType, relationIdNetMap]);
};

export * from './channelList';
export * from './channel';

import im, { ChannelStatusEnum, ChannelTypeEnum } from '@portkey-wallet/im';
import { useCallback, useMemo, useRef } from 'react';

import { CHANNEL_LIST_LIMIT } from '@portkey-wallet/constants/constants-ca/im';

import { useCurrentNetworkInfo } from '../network';
import { useAppCommonDispatch } from '../../index';
import {
  addChannel,
  nextChannelList,
  setChannelList,
  setHasNext,
  updateChannelAttribute,
} from '@portkey-wallet/store/store-ca/im/actions';
import { useIMChannelListNetMapState, useIMHasNextNetMapState } from '.';

export const useNextChannelList = () => {
  const channelListNetMap = useIMChannelListNetMapState();
  const hasNextNetMap = useIMHasNextNetMapState();

  const { networkType } = useCurrentNetworkInfo();
  const dispatch = useAppCommonDispatch();

  const channelList = useMemo(() => channelListNetMap?.[networkType], [channelListNetMap, networkType]);
  const hasNext = useMemo(
    () => (hasNextNetMap?.[networkType] !== undefined ? hasNextNetMap[networkType] : false),
    [hasNextNetMap, networkType],
  );

  const isLoadingRef = useRef(false);
  const next = useCallback(
    async (isInit = false) => {
      if (isLoadingRef.current) return;
      isLoadingRef.current = true;

      const lastCursor = isInit ? '' : channelList?.cursor || '';
      try {
        const result = await im.service.getChannelList({
          cursor: lastCursor,
          maxResultCount: CHANNEL_LIST_LIMIT,
        });

        const list = result.data?.list || [];
        const cursor = result.data?.cursor || lastCursor;

        const hasNextValue = list.length >= CHANNEL_LIST_LIMIT;
        dispatch(
          setHasNext({
            network: networkType,
            hasNext: hasNextValue,
          }),
        );

        if (isInit) {
          dispatch(
            setChannelList({
              network: networkType,
              channelList: {
                list,
                cursor,
              },
            }),
          );
        } else {
          dispatch(
            nextChannelList({
              network: networkType,
              channelList: {
                list,
                cursor,
              },
            }),
          );
        }
      } catch (error) {
        console.log('next: error', error);
        throw error;
      } finally {
        isLoadingRef.current = false;
      }
    },
    [channelList?.cursor, dispatch, networkType],
  );

  return {
    next,
    hasNext,
  };
};

export const useChannelList = () => {
  const channelListNetMap = useIMChannelListNetMapState();
  const { networkType } = useCurrentNetworkInfo();
  const { next, hasNext } = useNextChannelList();

  const rawList = useMemo(() => channelListNetMap?.[networkType]?.list || [], [channelListNetMap, networkType]);

  const list = useMemo(() => rawList.filter(item => !!item.lastPostAt), [rawList]);

  const init = useCallback(() => {
    return next(true);
  }, [next]);

  return {
    rawList,
    list,
    init,
    next,
    hasNext,
  };
};

export const useChannelItemInfo = (channelId: string) => {
  const { rawList } = useChannelList();

  return useMemo(() => {
    return rawList.find(item => item.channelUuid === channelId);
  }, [channelId, rawList]);
};

export const useCreateP2pChannel = () => {
  const { networkType } = useCurrentNetworkInfo();
  const { rawList } = useChannelList();
  const dispatch = useAppCommonDispatch();

  const createChannel = useCallback(
    async (relationId: string) => {
      let channel = rawList.find(item => item.toRelationId === relationId);
      if (channel) return channel;

      const result = await im.service.createChannel({
        name: '',
        type: ChannelTypeEnum.P2P,
        members: [relationId],
      });

      const channelUuid = result.data.channelUuid;
      channel = {
        status: ChannelStatusEnum.NORMAL,
        channelUuid,
        displayName: '',
        channelIcon: '',
        channelType: ChannelTypeEnum.P2P,
        unreadMessageCount: 0,
        mentionsCount: 0,
        lastMessageType: null,
        lastMessageContent: null,
        lastPostAt: null,
        mute: false,
        pin: false,
        toRelationId: relationId,
      };
      dispatch(
        addChannel({
          network: networkType,
          channel,
        }),
      );

      (async () => {
        try {
          const { data: channelInfo } = await im.service.getChannelInfo({
            channelUuid,
          });
          console.log('createChannel channelInfo: ', channelInfo);
          dispatch(
            updateChannelAttribute({
              network: networkType,
              channelId: channelUuid,
              value: {
                displayName: channelInfo.members.find(item => item.relationId === relationId)?.name || '',
                channelIcon: channelInfo.icon,
                mute: channelInfo.mute,
                pin: channelInfo.pin,
              },
            }),
          );
        } catch (error) {
          console.log('createChannel error: ', error);
        }
      })();

      return channel;
    },
    [dispatch, networkType, rawList],
  );
  return createChannel;
};

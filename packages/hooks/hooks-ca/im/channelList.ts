import im, { Message, ChannelTypeEnum } from '@portkey-wallet/im';
import { useCallback, useEffect, useMemo, useRef } from 'react';

import { CHANNEL_LIST_LIMIT } from '@portkey-wallet/constants/constants-ca/im';

import { useCurrentNetworkInfo } from '../network';
import { useAppCommonDispatch } from '../../index';
import {
  nextChannelList,
  setChannelList,
  setHasNext,
  updateChannelAttribute,
} from '@portkey-wallet/store/store-ca/im/actions';
import { UpdateChannelAttributeTypeEnum } from '@portkey-wallet/store/store-ca/im/type';
import { useImState } from '.';

export const useNextChannelList = () => {
  const { channelListNetMap, hasNextNetMap } = useImState();
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
  const { channelListNetMap } = useImState();
  const { networkType } = useCurrentNetworkInfo();
  const { next, hasNext } = useNextChannelList();
  const dispatch = useAppCommonDispatch();

  const list = useMemo(() => channelListNetMap?.[networkType]?.list || [], [channelListNetMap, networkType]);

  const updateUnreadChannel = useCallback(
    (message: Message) => {
      console.log('updateUnreadChannel', message);
      dispatch(
        updateChannelAttribute({
          network: networkType,
          channelId: message.channelUuid,
          value: {
            lastMessageType: message.type,
            lastMessageContent: message.content,
            lastPostAt: message.createAt,
          },
          type: UpdateChannelAttributeTypeEnum.UPDATE_UNREAD_CHANNEL,
        }),
      );
    },
    [dispatch, networkType],
  );
  const updateUnreadChannelRef = useRef(updateUnreadChannel);
  updateUnreadChannelRef.current = updateUnreadChannel;

  useEffect(() => {
    const { remove } = im.registerUnreadMsgObservers(e => {
      const rawMsg: Message = e['im-message'];
      updateUnreadChannelRef.current(rawMsg);
    });
    return remove;
  }, []);

  const init = useCallback(() => {
    return next(true);
  }, [next]);

  return {
    list,
    init,
    next,
    hasNext,
  };
};

export const useCreateP2pChannel = () => {
  const createChannel = useCallback((relationId: string) => {
    return im.service.createChannel({
      name: '',
      type: ChannelTypeEnum.P2P,
      members: [relationId],
    });
  }, []);
  return createChannel;
};

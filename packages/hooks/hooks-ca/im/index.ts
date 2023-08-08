import im, { utils, MessageType, ChannelInfo } from '@portkey-wallet/im';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useAppCASelector } from '../.';
import {
  addMessage,
  clearChannel,
  nextList,
  setHasNext as setHasNextMessage,
  setList,
  updateMessage,
  useChannelContext,
} from './channelContext';
import { randomId } from '@portkey-wallet/utils';
import { CHANNEL_LIST_LIMIT, IMErrorEnum, MESSAGE_LIST_LIMIT } from '@portkey-wallet/constants/constants-ca/im';
import { MessageStatusEnum, MessageWithStatus } from '@portkey-wallet/types/types-ca/im';
import { useCurrentNetworkInfo } from '../network';
import { useAppCommonDispatch } from '../../index';
import {
  nextChannelList,
  setChannelList,
  setHasNext as setHasNextChannel,
} from '@portkey-wallet/store/store-ca/im/actions';

export const useImState = () => useAppCASelector(state => state.im);

export const useChannel = (chanelId: string) => {
  const [{ list, hasNext }, dispatch] = useChannelContext();
  const [info, setInfo] = useState<ChannelInfo>();
  const listRef = useRef(list);
  listRef.current = list;

  const [loading, setLoading] = useState(false);
  const isNextLoading = useRef(false);
  const next = useCallback(
    async (isInit = false) => {
      const imInstance = im.getInstance();
      if (!imInstance) {
        throw {
          code: IMErrorEnum.NO_IM_INSTANCE,
          message: 'No im instance',
        };
      }

      if (isNextLoading.current) return;
      isNextLoading.current = true;

      let maxCreateAt = Date.now();
      if (!isInit) {
        const list = listRef.current;
        const lastMsg = list[0];
        maxCreateAt = lastMsg?.createAt ? Number(lastMsg?.createAt) : Date.now();
      }

      setLoading(true);
      try {
        const result = await imInstance.messageList({
          channelUuid: chanelId,
          maxCreateAt,
          limit: MESSAGE_LIST_LIMIT,
        });
        const length = result.data?.length || 0;
        const hasNextValue = length >= MESSAGE_LIST_LIMIT;
        dispatch(setHasNextMessage(hasNextValue));

        const list = result.data.map((item: any) => utils.messageParser(item));
        if (isInit) {
          dispatch(setList(list));
          imInstance.messageRead({ channelUuid: chanelId, total: 9999 }).then(() => {
            // TODO: refresh total unread
          });
        } else {
          dispatch(nextList(list));
        }
      } catch (error) {
        console.log('next: error', error);
        throw error;
      } finally {
        setLoading(false);
        isNextLoading.current = false;
      }
    },
    [chanelId, dispatch],
  );

  const init = useCallback(() => {
    dispatch(clearChannel());
    return next(true);
  }, [dispatch, next]);

  const errorHandler = useCallback(
    async (e: any) => {
      console.log('errorHandler', e);
      try {
        await init();
      } catch (error) {
        console.log('errorHandler:init error', error);
      }
    },
    [init],
  );
  const errorHandlerRef = useRef(errorHandler);
  errorHandlerRef.current = errorHandler;

  const updateList = useCallback(
    (e: any) => {
      const rawMsg = e['im-message'];
      if (rawMsg.channelUuid !== chanelId) return;
      const parseredMsg = utils.messageParser(rawMsg);
      dispatch(addMessage(parseredMsg));
      console.log('result', parseredMsg);
    },
    [chanelId, dispatch],
  );
  const updateListRef = useRef(updateList);
  updateListRef.current = updateList;

  useEffect(() => {
    const msgKey = im.registerMsgObserver(e => {
      updateListRef.current(e);
    });
    const errorKey = im.registerErrorObserver(e => {
      errorHandlerRef.current(e);
    });

    const imInstance = im.getInstance();
    if (imInstance) {
      imInstance.channelInfo(chanelId).then(result => {
        console.log('channelInfo', result.data);
        setInfo(result.data);
      });
    } else {
      console.log('use Channel init,No im instance');
    }

    return () => {
      im.removeMsgObserver(msgKey);
      im.removeErrorObserver(errorKey);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const sendMessage = useCallback(
    async (msg: string) => {
      const imInstance = im.getInstance();
      if (!imInstance) {
        throw {
          code: IMErrorEnum.NO_IM_INSTANCE,
          message: 'No im instance',
        };
      }
      // TODO: need check
      const userInfo = im.userInfo;
      if (!userInfo) {
        throw new Error('No user info');
      }
      const uuid = randomId();
      const msgParams = {
        channelUuid: chanelId,
        type: 'TEXT' as MessageType,
        content: msg,
        sendUuid: `${userInfo.relationId}-${chanelId}-${Date.now()}-${uuid}`,
      };

      const msgObj: MessageWithStatus = {
        ...msgParams,
        from: userInfo.relationId,
        fromAvatar: userInfo.avatar,
        fromName: userInfo.name,
        createAt: `${Date.now()}`,
        parsedContent: msgParams.content,
        status: MessageStatusEnum.SENDING,
      };
      dispatch(addMessage(msgObj));

      try {
        await imInstance.sendMessage(msgParams);
      } catch (error) {
        dispatch(
          updateMessage({
            ...msgObj,
            status: MessageStatusEnum.FAILED,
          }),
        );

        throw error;
      }
      dispatch(
        updateMessage({
          ...msgObj,
          status: MessageStatusEnum.SENT,
        }),
      );
    },
    [chanelId, dispatch],
  );

  const deleteMessage = useCallback(async (msgId: string) => {
    const imInstance = im.getInstance();
    if (!imInstance) {
      throw {
        code: IMErrorEnum.NO_IM_INSTANCE,
        message: 'No im instance',
      };
    }

    //
  }, []);

  return {
    info,
    list,
    next,
    hasNext,
    sendMessage,
    init,
    loading,
    deleteMessage,
  };
};

export const useNextChannelList = () => {
  const { channelListNetMap, hasNextNetMap } = useImState();
  const { networkType } = useCurrentNetworkInfo();
  const dispatch = useAppCommonDispatch();

  const channelList = useMemo(() => channelListNetMap?.[networkType], [channelListNetMap, networkType]);
  const hasNext = useMemo(
    () => (hasNextNetMap?.[networkType] !== undefined ? hasNextNetMap[networkType] : true),
    [hasNextNetMap, networkType],
  );

  const isLoadingRef = useRef(false);
  const next = useCallback(
    async (isInit = false) => {
      const imInstance = im.getInstance();
      if (!imInstance) {
        throw {
          code: IMErrorEnum.NO_IM_INSTANCE,
          message: 'No im instance',
        };
      }

      if (isLoadingRef.current) return;
      isLoadingRef.current = true;

      const lastCursor = isInit ? '' : channelList?.cursor || '';
      try {
        const result = await imInstance.userChannelsList({
          cursor: lastCursor,
          limit: CHANNEL_LIST_LIMIT,
        });

        const list = result.data?.list || [];
        const cursor = result.data?.cursor || lastCursor;

        const hasNextValue = list.length >= CHANNEL_LIST_LIMIT;
        dispatch(
          setHasNextChannel({
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

  const list = useMemo(() => channelListNetMap?.[networkType]?.list || [], [channelListNetMap, networkType]);

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
    const imInstance = im.getInstance();
    if (!imInstance) {
      throw {
        code: IMErrorEnum.NO_IM_INSTANCE,
        message: 'No im instance',
      };
    }
    return imInstance.channelCreate({
      name: 'test',
      type: 'P',
      members: [relationId],
    });
  }, []);
  return createChannel;
};

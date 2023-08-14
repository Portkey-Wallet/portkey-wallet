import im, { utils, MessageType, ChannelInfo, MessageCount, Message } from '@portkey-wallet/im';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useAppCASelector } from '../.';
import { randomId } from '@portkey-wallet/utils';
import { CHANNEL_LIST_LIMIT, IMErrorEnum, MESSAGE_LIST_LIMIT } from '@portkey-wallet/constants/constants-ca/im';

import { useCurrentNetworkInfo } from '../network';
import { useAppCommonDispatch } from '../../index';
import {
  removeChannel,
  nextChannelList,
  setChannelList,
  setHasNext as setHasNextChannel,
  updateChannelAttribute,
  deleteChannelMessage,
  setChannelMessageList,
  nextChannelMessageList,
  addChannelMessage,
} from '@portkey-wallet/store/store-ca/im/actions';
import { UpdateChannelAttributeTypeEnum } from '@portkey-wallet/store/store-ca/im/type';

export const useImState = () => useAppCASelector(state => state.im);

export const useChannel = (channelId: string) => {
  const { networkType } = useCurrentNetworkInfo();
  const dispatch = useAppCommonDispatch();
  const { channelMessageListNetMap } = useImState();

  const list = useMemo(
    () => channelMessageListNetMap?.[networkType]?.[channelId] || [],
    [channelId, channelMessageListNetMap, networkType],
  );
  const listRef = useRef(list);
  listRef.current = list;

  const muteChannel = useMuteChannel();
  const pinChannel = usePinChannel();
  const hideChannel = useHideChannel();

  const [info, setInfo] = useState<ChannelInfo>();
  const [hasNext, setHasNext] = useState(false);

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
          channelUuid: channelId,
          maxCreateAt,
          limit: MESSAGE_LIST_LIMIT,
        });
        const length = result.data?.length || 0;
        const hasNextValue = length >= MESSAGE_LIST_LIMIT;
        setHasNext(hasNextValue);

        const list: Message[] = result.data.map((item: any) => utils.messageParser(item));
        if (isInit) {
          dispatch(
            setChannelMessageList({
              network: networkType,
              channelId,
              list,
            }),
          );
          imInstance.messageRead({ channelUuid: channelId, total: 9999 }).then(() => {
            refreshMessageCount();
            dispatch(
              updateChannelAttribute({
                network: networkType,
                channelId: channelId,
                value: {
                  unreadMessageCount: 0,
                },
              }),
            );
          });
        } else {
          dispatch(
            nextChannelMessageList({
              network: networkType,
              channelId,
              list,
            }),
          );
        }
      } catch (error) {
        console.log('next: error', error);
        throw error;
      } finally {
        setLoading(false);
        isNextLoading.current = false;
      }
    },
    [channelId, dispatch, networkType],
  );

  const init = useCallback(() => {
    return next(true);
  }, [next]);

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

  const read = useCallback(() => {
    const imInstance = im.getInstance();
    if (!imInstance) {
      console.log('read: No im instance');
      return;
    }

    imInstance.messageRead({ channelUuid: channelId, total: 9999 });
  }, [channelId]);

  const updateList = useCallback(
    (e: any) => {
      const rawMsg = e['im-message'];
      if (rawMsg.channelUuid !== channelId) return;
      const parsedMsg = utils.messageParser(rawMsg);
      dispatch(
        addChannelMessage({
          network: networkType,
          channelId,
          message: parsedMsg,
        }),
      );
      read();
      dispatch(
        updateChannelAttribute({
          network: networkType,
          channelId: channelId,
          value: {
            lastMessageType: parsedMsg.type,
            lastMessageContent: parsedMsg.content,
            lastPostAt: parsedMsg.createAt,
          },
        }),
      );
      console.log('result', parsedMsg);
    },
    [channelId, dispatch, networkType, read],
  );
  const updateListRef = useRef(updateList);
  updateListRef.current = updateList;

  useEffect(() => {
    const { remove: removeMsgObserver } = im.registerChannelMsgObserver(channelId, e => {
      updateListRef.current(e);
    });
    const { remove: removeErrorObserver } = im.registerErrorObserver(e => {
      errorHandlerRef.current(e);
    });

    const imInstance = im.getInstance();
    if (imInstance) {
      imInstance.channelInfo(channelId).then(result => {
        console.log('channelInfo', result.data);
        setInfo(result.data);
      });
    } else {
      console.log('use Channel init,No im instance');
    }

    return () => {
      removeMsgObserver();
      removeErrorObserver();
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
        channelUuid: channelId,
        type: 'TEXT' as MessageType,
        content: msg,
        sendUuid: `${userInfo.relationId}-${channelId}-${Date.now()}-${uuid}`,
      };

      const msgObj: Message = {
        ...msgParams,
        from: userInfo.relationId,
        fromAvatar: userInfo.avatar,
        fromName: userInfo.name,
        createAt: `${Date.now()}`,
        parsedContent: msgParams.content,
      };
      dispatch(
        addChannelMessage({
          network: networkType,
          channelId,
          message: msgObj,
        }),
      );

      try {
        await imInstance.sendMessage(msgParams);
        dispatch(
          updateChannelAttribute({
            network: networkType,
            channelId: channelId,
            value: {
              lastMessageType: msgObj.type,
              lastMessageContent: msgObj.content,
              lastPostAt: msgObj.createAt,
            },
          }),
        );
      } catch (error) {
        console.log('error', error);
        throw error;
      }
    },
    [channelId, dispatch, networkType],
  );

  const deleteMessage = useCallback(
    async (sendUuid: string) => {
      const imInstance = im.getInstance();
      if (!imInstance) {
        throw {
          code: IMErrorEnum.NO_IM_INSTANCE,
          message: 'No im instance',
        };
      }

      // TODO: add delete request

      const list = listRef.current || [];
      if (list.length <= 0) return;

      const latestMsg = list[list.length - 1];
      if (latestMsg.sendUuid === sendUuid) {
        if (list.length <= 1) {
          dispatch(
            updateChannelAttribute({
              network: networkType,
              channelId: channelId,
              value: {
                lastMessageType: 'TEXT',
                lastMessageContent: '',
              },
            }),
          );
        } else {
          const nextMsg = list[list.length - 2];
          dispatch(
            updateChannelAttribute({
              network: networkType,
              channelId: channelId,
              value: {
                lastMessageType: nextMsg.type,
                lastMessageContent: nextMsg.content,
              },
            }),
          );
        }
      }
      dispatch(
        deleteChannelMessage({
          network: networkType,
          channelId,
          sendUuid,
        }),
      );
    },
    [channelId, dispatch, networkType],
  );

  const mute = useCallback(async (value: boolean) => muteChannel(channelId, value, false), [channelId, muteChannel]);

  const pin = useCallback(async (value: boolean) => pinChannel(channelId, value), [channelId, pinChannel]);

  const exit = useCallback(async () => hideChannel(channelId), [channelId, hideChannel]);

  return {
    info,
    list,
    next,
    hasNext,
    sendMessage,
    init,
    loading,
    mute,
    pin,
    exit,
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

export const refreshMessageCount = async () => {
  const imInstance = im.getInstance();
  if (!imInstance) {
    throw {
      code: IMErrorEnum.NO_IM_INSTANCE,
      message: 'No im instance',
    };
  }

  // TODO: add refreshMessageCount request
  const messageCount: MessageCount = {
    unreadCount: 0,
    mentionsCount: 0,
  };

  im.updateMessageCount(messageCount);
  return messageCount;
};

export const useUnreadCount = () => {
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const { unreadCount } = im.getMessageCount();
    setUnreadCount(unreadCount);

    const { remove: removeMessageCountObserver } = im.registerMessageCountObserver(e => {
      setUnreadCount(e.unreadCount);
    });

    return removeMessageCountObserver;
  }, []);

  return unreadCount;
};

export const useMuteChannel = () => {
  const { networkType } = useCurrentNetworkInfo();
  const dispatch = useAppCommonDispatch();

  const mute = useCallback(
    async (channelId: string, value: boolean, isRefreshTotal = true) => {
      // TODO: add mute request

      dispatch(
        updateChannelAttribute({
          network: networkType,
          channelId: channelId,
          value: {
            mute: value,
          },
        }),
      );
      if (isRefreshTotal) {
        //
        refreshMessageCount();
      }
    },
    [dispatch, networkType],
  );

  return mute;
};

export const usePinChannel = () => {
  const { networkType } = useCurrentNetworkInfo();
  const dispatch = useAppCommonDispatch();

  const pin = useCallback(
    async (channelId: string, value: boolean) => {
      // TODO: add pin request

      dispatch(
        updateChannelAttribute({
          network: networkType,
          channelId: channelId,
          value: {
            pin: value,
          },
        }),
      );
    },
    [dispatch, networkType],
  );

  return pin;
};

export const useHideChannel = () => {
  const { networkType } = useCurrentNetworkInfo();
  const dispatch = useAppCommonDispatch();

  const hide = useCallback(
    async (channelId: string) => {
      // TODO: add hide request

      dispatch(
        removeChannel({
          network: networkType,
          channelId,
        }),
      );
    },
    [dispatch, networkType],
  );

  return hide;
};

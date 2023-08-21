import im, { utils, MessageType, Message, TriggerMessageEventActionEnum } from '@portkey-wallet/im';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { randomId } from '@portkey-wallet/utils';
import { MESSAGE_LIST_LIMIT, SEARCH_CHANNEL_LIMIT } from '@portkey-wallet/constants/constants-ca/im';

import { useCurrentNetworkInfo } from '../network';
import { useAppCommonDispatch } from '../../index';
import {
  removeChannel,
  updateChannelAttribute,
  deleteChannelMessage,
  setChannelMessageList,
  nextChannelMessageList,
  addChannelMessage,
  updateChannelMessageAttribute,
} from '@portkey-wallet/store/store-ca/im/actions';

import { useChannelItemInfo, useImChannelMessageListNetMapState } from '.';
import s3Instance from '@portkey-wallet/utils/s3';
import { messageParser } from '@portkey-wallet/im/utils';
import { useContactRelationIdMap } from '../contact';

export type ImageMessageFileType = {
  body: string | File;
  suffix?: string;
  width: number;
  height: number;
};

export const useIsStranger = (relationId: string) => {
  const contactRelationIdMap = useContactRelationIdMap();
  return useMemo(() => {
    return !contactRelationIdMap?.[relationId];
  }, [contactRelationIdMap, relationId]);
};

export const useSendChannelMessage = () => {
  const dispatch = useAppCommonDispatch();
  const { networkType } = useCurrentNetworkInfo();

  const sendChannelMessage = useCallback(
    async (channelId: string, content: string, type = 'TEXT' as MessageType) => {
      const userInfo = im.userInfo;
      if (!userInfo) {
        throw new Error('No user info');
      }
      const uuid = randomId();
      const msgParams = {
        channelUuid: channelId,
        type,
        content,
        sendUuid: `${userInfo.relationId}-${channelId}-${Date.now()}-${uuid}`,
      };

      const msgObj: Message = messageParser({
        ...msgParams,
        from: userInfo.relationId,
        fromAvatar: userInfo.avatar,
        fromName: userInfo.name,
        createAt: `${Date.now()}`,
      });
      dispatch(
        addChannelMessage({
          network: networkType,
          channelId,
          message: msgObj,
        }),
      );

      try {
        const result = await im.service.sendMessage(msgParams);
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
        dispatch(
          updateChannelMessageAttribute({
            network: networkType,
            channelId: channelId,
            sendUuid: msgObj.sendUuid,
            value: {
              id: result.data.id,
            },
          }),
        );
      } catch (error) {
        console.log('error', error);
        throw error;
      }
    },
    [dispatch, networkType],
  );

  const sendChannelImage = useCallback(
    async (channelId: string, file: ImageMessageFileType) => {
      try {
        const s3Result = await s3Instance.uploadFile({
          body: file.body,
          suffix: file.suffix,
        });
        // const { thumbWidth, thumbHeight } = getThumbSize(file.width, file.height);
        // const thumbResult = await request.im.getImageThumb({
        //   params: {
        //     imageUrl: s3Result.url,
        //     width: thumbWidth,
        //     height: thumbHeight,
        //   },
        // });

        const p1Url = encodeURIComponent(s3Result.url);
        const p1Key = s3Result.key;
        const p2Url = encodeURIComponent(s3Result.url);
        const p2Key = s3Result.key;

        const content = `type:image;action:localImage;p1(Text):${p1Url},p2(Text):${p1Key},p3(Text):${p2Url},p4(Text):${p2Key},p5(Text):${file.width},p6(Text):${file.height}`;

        await sendChannelMessage(channelId, content, 'IMAGE');

        return s3Result;
      } catch (error) {
        console.log('sendChannelImage: error', error);
        throw error;
      }
    },
    [sendChannelMessage],
  );

  return {
    sendChannelMessage,
    sendChannelImage,
  };
};

export const useDeleteMessage = (channelId: string) => {
  const { networkType } = useCurrentNetworkInfo();
  const dispatch = useAppCommonDispatch();

  const channelMessageListNetMap = useImChannelMessageListNetMapState();
  const list = useMemo(
    () => channelMessageListNetMap?.[networkType]?.[channelId] || [],
    [channelId, channelMessageListNetMap, networkType],
  );
  const listRef = useRef(list);
  listRef.current = list;

  return useCallback(
    async (id?: string) => {
      if (!id) {
        throw new Error('no message id');
      }
      try {
        await im.service.deleteMessage({
          id,
        });

        const list = listRef.current || [];
        if (list.length <= 0) return;

        const latestMsg = list[list.length - 1];
        if (latestMsg.id === id) {
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
            id,
          }),
        );
      } catch (error) {
        console.log('deleteMessage: error', error);
        throw error;
      }
    },
    [channelId, dispatch, networkType],
  );
};

export const useChannel = (channelId: string) => {
  const { networkType } = useCurrentNetworkInfo();
  const dispatch = useAppCommonDispatch();

  const channelMessageListNetMap = useImChannelMessageListNetMapState();
  const list = useMemo(
    () => channelMessageListNetMap?.[networkType]?.[channelId] || [],
    [channelId, channelMessageListNetMap, networkType],
  );
  const listRef = useRef(list);
  listRef.current = list;

  const muteChannel = useMuteChannel();
  const pinChannel = usePinChannel();
  const hideChannel = useHideChannel();
  const { sendChannelMessage, sendChannelImage } = useSendChannelMessage();
  const deleteMessage = useDeleteMessage(channelId);
  const info = useChannelItemInfo(channelId);
  const isStranger = useIsStranger(info?.toRelationId || '');

  const [hasNext, setHasNext] = useState(false);

  const [loading, setLoading] = useState(false);
  const isNextLoading = useRef(false);

  const next = useCallback(
    async (isInit = false) => {
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
        const result = await im.service.getMessageList({
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
          im.service.readMessage({ channelUuid: channelId, total: 9999 }).then(() => {
            im.refreshMessageCount();
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
    im.service.readMessage({ channelUuid: channelId, total: 9999 });
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

    if (im.userInfo) {
      im.service.triggerMessageEvent({
        channelUuid: channelId,
        fromRelationId: im.userInfo?.relationId,
        action: TriggerMessageEventActionEnum.ENTER_CHANNEL,
      });
    }

    return () => {
      removeMsgObserver();
      removeErrorObserver();

      if (im.userInfo) {
        im.service.triggerMessageEvent({
          channelUuid: channelId,
          fromRelationId: im.userInfo?.relationId,
          action: TriggerMessageEventActionEnum.EXIT_CHANNEL,
        });
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const mute = useCallback(async (value: boolean) => muteChannel(channelId, value, false), [channelId, muteChannel]);

  const pin = useCallback(async (value: boolean) => pinChannel(channelId, value), [channelId, pinChannel]);

  const exit = useCallback(async () => hideChannel(channelId), [channelId, hideChannel]);

  const sendMessage = useCallback(
    (content: string, type?: MessageType) => {
      return sendChannelMessage(channelId, content, type);
    },
    [channelId, sendChannelMessage],
  );
  const sendImage = useCallback(
    (file: ImageMessageFileType) => {
      return sendChannelImage(channelId, file);
    },
    [channelId, sendChannelImage],
  );

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
    sendImage,
    isStranger,
  };
};

export const useMuteChannel = () => {
  const { networkType } = useCurrentNetworkInfo();
  const dispatch = useAppCommonDispatch();

  const mute = useCallback(
    async (channelId: string, value: boolean, isRefreshTotal = true) => {
      await im.service.updateChannelMute({
        channelUuid: channelId,
        mute: value,
      });

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
        im.refreshMessageCount();
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
      await im.service.updateChannelPin({
        channelUuid: channelId,
        pin: value,
      });

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
      await im.service.hideChannel({
        channelUuid: channelId,
      });

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

export const useSearchChannel = () => {
  return useCallback((keyword: string) => {
    return im.service.getChannelList({
      keyword,
      cursor: '',
      maxResultCount: SEARCH_CHANNEL_LIMIT,
    });
  }, []);
};

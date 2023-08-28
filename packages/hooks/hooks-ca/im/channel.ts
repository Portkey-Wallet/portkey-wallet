import im, { utils, MessageType, Message, TriggerMessageEventActionEnum } from '@portkey-wallet/im';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { randomId } from '@portkey-wallet/utils';
import { MESSAGE_LIST_LIMIT, SEARCH_CHANNEL_LIMIT } from '@portkey-wallet/constants/constants-ca/im';

import { useCurrentNetworkInfo } from '../network';
import { useAppCommonDispatch, useLatestRef } from '../../index';
import {
  removeChannel,
  updateChannelAttribute,
  deleteChannelMessage,
  setChannelMessageList,
  nextChannelMessageList,
  addChannelMessage,
  updateChannelMessageAttribute,
} from '@portkey-wallet/store/store-ca/im/actions';
import { useChannelItemInfo, useIMChannelMessageListNetMapState, useRelationId } from '.';
import s3Instance, { getThumbSize, UploadFileType } from '@portkey-wallet/utils/s3';
import { messageParser } from '@portkey-wallet/im/utils';
import { useContactRelationIdMap } from '../contact';
import { request } from '@portkey-wallet/api/api-did';

export type ImageMessageFileType = {
  body: string | File;
  suffix?: string;
  width: number;
  height: number;
};

export const useCurrentChannelMessageListNetMap = () => {
  const { networkType } = useCurrentNetworkInfo();
  const channelMessageListNetMap = useIMChannelMessageListNetMapState();
  return useMemo(() => channelMessageListNetMap?.[networkType], [channelMessageListNetMap, networkType]);
};

export const useCurrentChannelMessageList = (channelId: string) => {
  const channelMessageListNetMap = useCurrentChannelMessageListNetMap();
  return useMemo(() => channelMessageListNetMap?.[channelId] || [], [channelId, channelMessageListNetMap]);
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
  const relationId = useRelationId();

  const sendChannelMessage = useCallback(
    async (channelId: string, content: string, type = 'TEXT' as MessageType) => {
      if (!relationId) {
        throw new Error('No user info');
      }
      const uuid = randomId();
      const msgParams = {
        channelUuid: channelId,
        type,
        content,
        sendUuid: `${relationId}-${channelId}-${Date.now()}-${uuid}`,
      };

      const msgObj: Message = messageParser({
        ...msgParams,
        from: relationId,
        fromAvatar: '',
        fromName: '',
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
    [dispatch, networkType, relationId],
  );
  const sendChannelImageByS3Result = useCallback(
    async (channelId: string, s3Result: UploadFileType & ImageMessageFileType) => {
      try {
        const { thumbWidth, thumbHeight } = getThumbSize(s3Result.width, s3Result.height);

        const p1Url = encodeURIComponent(s3Result.url);
        const p1Key = s3Result.key;
        let p2Url = p1Url;
        let p2Key = p1Key;

        try {
          const thumbResult = await request.im.getImageThumb({
            params: {
              imageUrl: s3Result.url,
              width: thumbWidth,
              height: thumbHeight,
            },
          });
          if (thumbResult?.thumbnailUrl) {
            p2Url = encodeURIComponent(thumbResult.thumbnailUrl);
            p2Key = '';
          }
        } catch (error) {
          console.log('sendChannelImage: error', error);
        }

        const content = `type:image;action:localImage;p1(Text):${p1Url},p2(Text):${p1Key},p3(Text):${p2Url},p4(Text):${p2Key},p5(Text):${s3Result.width},p6(Text):${s3Result.height}`;

        return sendChannelMessage(channelId, content, 'IMAGE');
      } catch (error) {
        console.log('sendChannelImage: error', error);
        throw error;
      }
    },
    [sendChannelMessage],
  );
  const sendChannelImage = useCallback(
    async (channelId: string, file: ImageMessageFileType) => {
      try {
        const s3Result = await s3Instance.uploadFile({
          body: file.body,
          suffix: file.suffix,
        });
        await sendChannelImageByS3Result(channelId, { ...s3Result, ...file });
        return s3Result;
      } catch (error) {
        console.log('sendChannelImage: error', error);
        throw error;
      }
    },
    [sendChannelImageByS3Result],
  );

  return {
    sendChannelMessage,
    sendChannelImage,
    sendChannelImageByS3Result,
  };
};

export const useDeleteMessage = (channelId: string) => {
  const { networkType } = useCurrentNetworkInfo();
  const dispatch = useAppCommonDispatch();

  const list = useCurrentChannelMessageList(channelId);
  const listRef = useLatestRef(list);
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
                  lastMessageType: null,
                  lastMessageContent: null,
                  lastPostAt: null,
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
    [channelId, dispatch, listRef, networkType],
  );
};

export const useChannel = (channelId: string) => {
  const { networkType } = useCurrentNetworkInfo();
  const dispatch = useAppCommonDispatch();

  const relationId = useRelationId();
  const list = useCurrentChannelMessageList(channelId);
  const listRef = useLatestRef(list);

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
    [channelId, dispatch, listRef, networkType],
  );

  const init = useCallback(() => {
    return next(true);
  }, [next]);

  const connectHandler = useCallback(
    async (e: any) => {
      console.log('connectHandler', e);
      try {
        await init();
      } catch (error) {
        console.log('connectHandler:init error', error);
      }
    },
    [init],
  );
  const connectHandlerRef = useRef(connectHandler);
  connectHandlerRef.current = connectHandler;

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
    const { remove: removeConnectObserver } = im.registerConnectObserver(e => {
      connectHandlerRef.current(e);
    });

    if (relationId) {
      im.service.triggerMessageEvent({
        channelUuid: channelId,
        fromRelationId: relationId,
        action: TriggerMessageEventActionEnum.ENTER_CHANNEL,
      });
    }

    return () => {
      removeMsgObserver();
      removeConnectObserver();

      if (relationId) {
        im.service.triggerMessageEvent({
          channelUuid: channelId,
          fromRelationId: relationId,
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

      if (isRefreshTotal) {
        await im.service.readMessage({ channelUuid: channelId, total: 9999 });
      }

      dispatch(
        updateChannelAttribute({
          network: networkType,
          channelId: channelId,
          value: {
            mute: value,
            unreadMessageCount: 0,
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
      im.service.readMessage({ channelUuid: channelId, total: 9999 }).then(() => {
        im.refreshMessageCount();
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
  return useCallback(async (keyword: string) => {
    const { data } = await im.service.getChannelList({
      keyword,
      cursor: '',
      maxResultCount: SEARCH_CHANNEL_LIMIT,
    });
    return data?.list?.filter(ele => !!ele?.lastPostAt) || [];
  }, []);
};

export const useAddStranger = () => {
  return useCallback((relationId: string) => {
    return im.service.addStranger({
      relationId,
    });
  }, []);
};

export const useCheckIsStranger = () => {
  const contactRelationIdMap = useContactRelationIdMap();
  return useCallback(
    (relationId: string) => {
      return !contactRelationIdMap?.[relationId];
    },
    [contactRelationIdMap],
  );
};

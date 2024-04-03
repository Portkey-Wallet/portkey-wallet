import im, {
  MessageType,
  Message,
  TriggerMessageEventActionEnum,
  ChannelStatusEnum,
  MessageTypeEnum,
  RedPackageStatusEnum,
} from '@portkey-wallet/im';
import { useCallback, useMemo, useRef, useState } from 'react';
import { sleep } from '@portkey-wallet/utils';
import { MESSAGE_LIST_LIMIT, SEARCH_CHANNEL_LIMIT } from '@portkey-wallet/constants/constants-ca/im';

import { useCurrentNetworkInfo } from '../network';
import { useEffectOnce, useAppCommonDispatch, useLatestRef } from '../../index';
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
import { useCurrentUserInfo } from '../wallet';
import { IMServiceCommon, SendMessageResult } from '@portkey-wallet/im/types/service';
import useLockCallback from '../../useLockCallback';
import { useIMPin } from './pin';
import { getSendUuid } from '@portkey-wallet/utils/chat';
import { PIN_OPERATION_TYPE_ENUM } from '@portkey-wallet/im/types/pin';

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
  const { relationId, getRelationId } = useRelationId();
  const { nickName = '' } = useCurrentUserInfo() || {};

  const sendMessageToPeople = useCallback(
    async ({
      toRelationId,
      channelId,
      type = 'TEXT',
      content,
    }: {
      toRelationId?: string;
      channelId?: string;
      type?: MessageType;
      content: string;
    }) => {
      if (!(toRelationId || channelId)) {
        throw new Error('No ID');
      }
      let _relationId = relationId;
      if (!_relationId) {
        try {
          _relationId = await getRelationId();
        } catch (error) {
          throw new Error('No user info');
        }
      }

      return im.service.sendMessage({
        channelUuid: channelId,
        toRelationId,
        type,
        content,
        sendUuid: getSendUuid(_relationId, toRelationId || ''),
      });
    },

    [getRelationId, relationId],
  );

  const sendMassMessage = useCallback(
    ({
      toRelationIds = [],
      channelIds = [],
      content,
      type = 'TEXT',
    }: {
      toRelationIds?: string[];
      channelIds?: string[];
      content: string;
      type?: MessageType;
    }) => {
      if (!(toRelationIds.length || channelIds.length)) {
        throw new Error('No ID');
      }
      const promiseList: IMServiceCommon<SendMessageResult>[] = [];
      toRelationIds.forEach(toRelationId => {
        promiseList.push(
          sendMessageToPeople({
            toRelationId,
            content,
            type,
          }),
        );
      });
      channelIds.forEach(channelId => {
        promiseList.push(
          sendMessageToPeople({
            channelId,
            content,
            type,
          }),
        );
      });
      return Promise.allSettled(promiseList);
    },
    [sendMessageToPeople],
  );

  const sendChannelMessage = useCallback(
    async ({
      channelId,
      content,
      type = 'TEXT',
      quoteMessage: _quoteMessage,
    }: {
      channelId: string;
      content: string;
      type?: MessageType;
      quoteMessage?: Message;
    }) => {
      let _relationId = relationId;
      if (!_relationId) {
        try {
          _relationId = await getRelationId();
        } catch (error) {
          throw new Error('No user info');
        }
      }
      const quoteMessage = _quoteMessage ? { ..._quoteMessage } : undefined;
      const msgParams = {
        channelUuid: channelId,
        type,
        content,
        sendUuid: getSendUuid(_relationId, channelId),
        quoteId: quoteMessage?.id,
      };

      const msgObj: Message = messageParser({
        ...msgParams,
        from: _relationId,
        fromAvatar: '',
        fromName: nickName,
        createAt: `${Date.now()}`,
      });
      msgObj.quote = quoteMessage;

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
              lastMessageContent: msgObj.parsedContent,
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
    [dispatch, getRelationId, networkType, nickName, relationId],
  );
  const sendChannelImageByS3Result = useCallback(
    async ({
      channelId,
      s3Result,
      quoteMessage,
    }: {
      channelId: string;
      s3Result: UploadFileType & ImageMessageFileType;
      quoteMessage?: Message;
    }) => {
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

        return sendChannelMessage({
          channelId,
          content,
          type: 'IMAGE',
          quoteMessage,
        });
      } catch (error) {
        console.log('sendChannelImage: error', error);
        throw error;
      }
    },
    [sendChannelMessage],
  );
  const sendChannelImage = useCallback(
    async ({
      channelId,
      file,
      quoteMessage,
    }: {
      channelId: string;
      file: ImageMessageFileType;
      quoteMessage?: Message;
    }) => {
      try {
        const s3Result = await s3Instance.uploadFile({
          body: file.body,
          suffix: file.suffix,
        });
        await sendChannelImageByS3Result({
          channelId,
          s3Result: { ...s3Result, ...file },
          quoteMessage,
        });
        return s3Result;
      } catch (error) {
        console.log('sendChannelImage: error', error);
        throw error;
      }
    },
    [sendChannelImageByS3Result],
  );

  return {
    sendMessageToPeople,
    sendMassMessage,
    sendChannelMessage,
    sendChannelImage,
    sendChannelImageByS3Result,
  };
};

export const useDeleteMessage = (channelId: string) => {
  const { networkType } = useCurrentNetworkInfo();
  const dispatch = useAppCommonDispatch();
  const { refresh: refreshPin, addMockPinSysMessage } = useIMPin(channelId);

  const list = useCurrentChannelMessageList(channelId);
  const listRef = useLatestRef(list);
  return useCallback(
    async (message: Message) => {
      const { id } = message;
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
                  lastMessageContent: nextMsg.parsedContent,
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

        if (message.pinInfo) {
          refreshPin();
          addMockPinSysMessage(PIN_OPERATION_TYPE_ENUM.UnPin, message);
        }
      } catch (error) {
        console.log('deleteMessage: error', error);
        throw error;
      }
    },
    [addMockPinSysMessage, channelId, dispatch, listRef, networkType, refreshPin],
  );
};

export const useChannelMessageList = (channelId: string) => {
  const { networkType } = useCurrentNetworkInfo();
  const list = useCurrentChannelMessageList(channelId);
  const listRef = useLatestRef(list);
  const [loading, setLoading] = useState(false);
  const [hasNext, setHasNext] = useState(true);
  const dispatch = useAppCommonDispatch();

  const next = useLockCallback(
    async (isInit = false) => {
      let maxCreateAt = Date.now();
      if (!isInit) {
        const list = listRef.current;
        const lastMsg = list[0];
        maxCreateAt = lastMsg?.createAt ? Number(lastMsg?.createAt) : Date.now();
      } else {
        im.service.readMessage({ channelUuid: channelId, total: 9999 }).then(async () => {
          await sleep(500);
          dispatch(
            updateChannelAttribute({
              network: networkType,
              channelId: channelId,
              value: {
                unreadMessageCount: 0,
              },
            }),
          );
          im.refreshMessageCount();
        });
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

        const list: Message[] = result.data.map((item: any) => messageParser(item));
        if (isInit) {
          dispatch(
            setChannelMessageList({
              network: networkType,
              channelId,
              list,
            }),
          );
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
      }
    },
    [channelId, dispatch, listRef, networkType],
  );

  const init = useCallback(() => {
    return next(true);
  }, [next]);

  return {
    list,
    next,
    hasNext,
    init,
    loading,
  };
};

export const useChannel = (channelId: string) => {
  const { networkType } = useCurrentNetworkInfo();
  const dispatch = useAppCommonDispatch();

  const { relationId } = useRelationId();

  const muteChannel = useMuteChannel();
  const pinChannel = usePinChannel();
  const hideChannel = useHideChannel();
  const { sendChannelMessage, sendChannelImage } = useSendChannelMessage();
  const deleteMessage = useDeleteMessage(channelId);
  const info = useChannelItemInfo(channelId);
  const isStranger = useIsStranger(info?.toRelationId || '');
  const { list, next, hasNext, init, loading } = useChannelMessageList(channelId);
  const listRef = useRef(list);
  listRef.current = list;

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
      if (listRef.current.findIndex(ele => ele.sendUuid === rawMsg.sendUuid) >= 0) return;
      const parsedMsg = messageParser(rawMsg);
      if (parsedMsg.type === MessageTypeEnum.REDPACKAGE_CARD) {
        parsedMsg.redPackage = {
          viewStatus: RedPackageStatusEnum.UNOPENED,
        };
      }
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
            lastMessageContent: parsedMsg.parsedContent,
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

  useEffectOnce(() => {
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
      console.log('exit channel');
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
  });

  const mute = useCallback(async (value: boolean) => muteChannel(channelId, value, false), [channelId, muteChannel]);

  const pin = useCallback(async (value: boolean) => pinChannel(channelId, value), [channelId, pinChannel]);

  const exit = useCallback(async () => hideChannel(channelId), [channelId, hideChannel]);

  const sendMessage = useCallback(
    ({ content, type, quoteMessage }: { content: string; type?: MessageType; quoteMessage?: Message }) => {
      return sendChannelMessage({
        channelId,
        content,
        type,
        quoteMessage,
      });
    },
    [channelId, sendChannelMessage],
  );
  const sendImage = useCallback(
    (file: ImageMessageFileType) => {
      return sendChannelImage({
        channelId,
        file,
      });
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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async (channelId: string, value: boolean, _isRefreshTotal = true) => {
      await im.service.updateChannelMute({
        channelUuid: channelId,
        mute: value,
      });

      // if (isRefreshTotal) {
      //   await im.service.readMessage({ channelUuid: channelId, total: 9999 });
      // }

      dispatch(
        updateChannelAttribute({
          network: networkType,
          channelId: channelId,
          value: {
            mute: value,
            // unreadMessageCount: 0,
          },
        }),
      );

      // if (isRefreshTotal) {
      //   im.refreshMessageCount();
      // }
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
            pinAt: String(Date.now()),
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
    async (channelId: string, isLocalImmediateDelete = false) => {
      if (isLocalImmediateDelete) {
        dispatch(
          removeChannel({
            network: networkType,
            channelId,
          }),
        );
      }
      await im.service.hideChannel({
        channelUuid: channelId,
      });
      im.service.readMessage({ channelUuid: channelId, total: 9999 }).then(() => {
        im.refreshMessageCount();
      });
      if (!isLocalImmediateDelete) {
        dispatch(
          removeChannel({
            network: networkType,
            channelId,
          }),
        );
      }
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
    return data?.list?.filter(ele => !!ele?.lastPostAt && ele?.status === ChannelStatusEnum.NORMAL) || [];
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

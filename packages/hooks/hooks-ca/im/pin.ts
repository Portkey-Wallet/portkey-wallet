import { useCallback, useMemo, useRef } from 'react';
import { useIMLastPinNetMapState, useIMPinListNetMapState } from './index';
import { useCurrentNetworkInfo } from '../network';
import im, { Message, MessageTypeEnum, ParsedPinSys, SocketMessage } from '@portkey-wallet/im';
import { PIN_MESSAGE_LIST_LIMIT } from '@portkey-wallet/constants/constants-ca/im';
import { useAppCommonDispatch, useEffectOnce } from '../../index';
import {
  addChannelMessage,
  cleanALLChannelMessagePin,
  nextPinList,
  setLastPinMessage,
  setPinList,
  updateChannelAttribute,
  updateChannelMessageAttribute,
} from '@portkey-wallet/store/store-ca/im/actions';
import { IM_PIN_LIST_SORT_TYPE_ENUM } from '@portkey-wallet/im/constant';
import { PIN_OPERATION_TYPE_ENUM } from '@portkey-wallet/im/types/pin';
import { getSendUuid } from '@portkey-wallet/utils/chat';
import { messageParser } from '@portkey-wallet/im/utils';
import { useCurrentUserInfo } from '../wallet';

export const useIMPin = (channelId: string, isRegister = false) => {
  const { networkType } = useCurrentNetworkInfo();
  const dispatch = useAppCommonDispatch();
  const userInfo = useCurrentUserInfo();
  const pinListNetMap = useIMPinListNetMapState();
  const list = useMemo(
    () => pinListNetMap?.[networkType]?.[channelId]?.list || [],
    [channelId, networkType, pinListNetMap],
  );

  const LastPinNetMap = useIMLastPinNetMapState();
  const lastPinMessage: Message | undefined = useMemo(() => {
    const _msg = LastPinNetMap?.[networkType]?.[channelId]?.message;
    if (_msg) {
      return messageParser(_msg);
    }
    return _msg;
  }, [LastPinNetMap, channelId, networkType]);
  const lastPinMessageRef = useRef(lastPinMessage);
  lastPinMessageRef.current = lastPinMessage;

  const pagerRef = useRef({
    skipCount: 0,
    maxResultCount: PIN_MESSAGE_LIST_LIMIT,
    totalCount: 0,
    fetchTime: 0,
    initTime: 0,
  });

  const lastPinFetchTime = useRef(0);

  const next = useCallback(
    async (isInit = false) => {
      if (isInit) {
        pagerRef.current.skipCount = 0;
        pagerRef.current.totalCount = 0;
        pagerRef.current.initTime = Date.now();
      }

      const { skipCount, maxResultCount, initTime: preInitTime } = pagerRef.current;
      const fetchTime = Date.now();

      try {
        const {
          data: { data: items, totalCount },
        } = await im.service.getPinList({
          channelUuid: channelId,
          sortType: IM_PIN_LIST_SORT_TYPE_ENUM.MessageCreate,
          ascending: true,
          maxResultCount,
          skipCount,
        });
        // handle next
        if (skipCount !== 0 && preInitTime !== pagerRef.current.initTime) return;
        if (pagerRef.current.fetchTime > fetchTime) return;

        pagerRef.current.fetchTime = fetchTime;
        pagerRef.current.skipCount = skipCount + items.length;
        pagerRef.current.totalCount = totalCount;

        const _parseMsgs = items.map(_item => messageParser(_item));

        if (skipCount === 0) {
          dispatch(
            setPinList({
              network: networkType,
              channelId: channelId,
              list: _parseMsgs,
              fetchTime: fetchTime,
            }),
          );
        } else {
          dispatch(
            nextPinList({
              network: networkType,
              channelId: channelId,
              list: _parseMsgs,
              fetchTime: fetchTime,
            }),
          );
        }
      } catch (error) {
        console.log('useIMPin next', error);
      }
    },
    [channelId, dispatch, networkType],
  );

  const initList = useCallback(() => {
    next(true);
  }, [next]);

  const refreshLastPin = useCallback(async () => {
    const fetchTime = Date.now();
    try {
      const {
        data: { data: pinList },
      } = await im.service.getPinList({
        channelUuid: channelId,
        sortType: IM_PIN_LIST_SORT_TYPE_ENUM.Pin,
        ascending: false,
        maxResultCount: 1,
        skipCount: 0,
      });
      if (lastPinFetchTime.current > fetchTime) return;
      lastPinFetchTime.current = fetchTime;
      const pinMessage: Message | undefined = pinList?.[0];
      dispatch(
        setLastPinMessage({
          network: networkType,
          channelId: channelId,
          message: pinMessage,
          fetchTime: fetchTime,
        }),
      );
    } catch (error) {
      console.log('useIMPin refreshLastPin', error);
    }
  }, [channelId, dispatch, networkType]);

  const refresh = useCallback(async () => {
    const promiseList = [refreshLastPin(), initList()];
    await Promise.all(promiseList);
  }, [initList, refreshLastPin]);
  const refreshRef = useRef(refresh);
  refreshRef.current = refresh;

  const handlePinSystemMsg = useCallback(
    (e: SocketMessage) => {
      if (e.type !== MessageTypeEnum.PIN_SYS) return;
      const fetchTime = Date.now();
      const pinSysMessage = messageParser(e);
      const parsedContent = pinSysMessage.parsedContent as ParsedPinSys | undefined;
      if (!parsedContent) {
        refreshRef.current();
        return;
      }
      if (parsedContent.pinType === PIN_OPERATION_TYPE_ENUM.RemoveAll) {
        dispatch(
          cleanALLChannelMessagePin({
            network: networkType,
            channelId: channelId,
          }),
        );
        dispatch(
          setLastPinMessage({
            network: networkType,
            channelId: channelId,
            message: undefined,
            fetchTime,
          }),
        );
        dispatch(
          setPinList({
            network: networkType,
            channelId: channelId,
            list: [],
            fetchTime: fetchTime,
          }),
        );
        refreshRef.current();
        return;
      }

      dispatch(
        updateChannelMessageAttribute({
          network: networkType,
          channelId: channelId,
          sendUuid: parsedContent.sendUuid,
          value: {
            pinInfo:
              parsedContent.pinType === PIN_OPERATION_TYPE_ENUM.Pin
                ? {
                    pinner: parsedContent.userInfo?.portkeyId || '',
                    pinnerName: parsedContent.userInfo?.name || '',
                    pinnedAt: `${fetchTime}`,
                  }
                : undefined,
          },
        }),
      );
      refreshRef.current();
    },
    [channelId, dispatch, networkType],
  );
  const handlePinSystemMsgRef = useRef(handlePinSystemMsg);
  handlePinSystemMsgRef.current = handlePinSystemMsg;

  useEffectOnce(() => {
    if (!isRegister) return;
    const { remove: removeMsgObserver } = im.registerChannelMsgObserver(channelId, (e: any) => {
      const _msg: SocketMessage = e['im-message'];
      handlePinSystemMsgRef.current(_msg);
    });
    const { remove: removeConnectObserver } = im.registerConnectObserver(() => {
      refreshRef.current();
    });

    return () => {
      console.log('useIMPin clear');
      removeMsgObserver();
      removeConnectObserver();
    };
  });

  const addMockPinSysMessage = useCallback(
    (type: PIN_OPERATION_TYPE_ENUM, message?: Message) => {
      const createAt = `${Date.now()}`;

      const pinSysContent: ParsedPinSys = {
        userInfo: {
          portkeyId: userInfo?.userId || '',
          name: userInfo?.nickName || '',
        },
        pinType: type,
        messageType: MessageTypeEnum.TEXT,
        content: '',
        messageId: '',
        sendUuid: '',
        unpinnedCount: list?.length,
      };

      if (type !== PIN_OPERATION_TYPE_ENUM.RemoveAll && message) {
        pinSysContent.messageType = message.type;
        pinSysContent.content = message.content;
      }

      const pinSysMessageRaw: Message = {
        channelUuid: channelId,
        sendUuid: getSendUuid('', channelId),
        type: MessageTypeEnum.PIN_SYS,
        content: JSON.stringify(pinSysContent),
        createAt,
        from: '',
      };

      const pinSysMessage = messageParser(pinSysMessageRaw);

      dispatch(
        addChannelMessage({
          network: networkType,
          channelId,
          message: pinSysMessage,
        }),
      );
      dispatch(
        updateChannelAttribute({
          network: networkType,
          channelId: channelId,
          value: {
            lastMessageType: MessageTypeEnum.PIN_SYS,
            lastMessageContent: pinSysMessage.parsedContent,
            lastPostAt: createAt,
          },
        }),
      );
    },
    [channelId, dispatch, list?.length, networkType, userInfo?.nickName, userInfo?.userId],
  );

  const pin = useCallback(
    async (_message: Message) => {
      if (!_message.id) throw new Error('message id is null');
      const message = { ..._message };
      delete message.parsedContent;
      delete message.unidentified;
      delete message.pinInfo;
      if (message.quote) {
        const quote = { ...message.quote };
        delete quote.parsedContent;
        delete quote.unidentified;
        delete quote.pinInfo;
        message.quote = quote;
      }

      await im.service.setPin(message);
      dispatch(
        setLastPinMessage({
          network: networkType,
          channelId: channelId,
          message: message,
          fetchTime: Date.now(),
        }),
      );

      const createAt = `${Date.now()}`;
      const pinInfo = {
        pinner: userInfo?.userId || '',
        pinnerName: userInfo?.nickName || '',
        pinnedAt: createAt,
      };
      dispatch(
        updateChannelMessageAttribute({
          network: networkType,
          channelId: channelId,
          sendUuid: message.sendUuid,
          value: {
            pinInfo,
          },
        }),
      );

      addMockPinSysMessage(PIN_OPERATION_TYPE_ENUM.Pin, message);

      initList();
    },
    [addMockPinSysMessage, channelId, dispatch, initList, networkType, userInfo?.nickName, userInfo?.userId],
  );

  const unPin = useCallback(
    async (message: Message) => {
      const { id } = message;
      if (!id) return;
      await im.service.unPin({
        id,
        channelUuid: channelId,
      });
      if (lastPinMessageRef.current?.id === id) {
        refreshLastPin();
      }
      dispatch(
        updateChannelMessageAttribute({
          network: networkType,
          channelId: channelId,
          sendUuid: message.sendUuid,
          value: {
            pinInfo: undefined,
          },
        }),
      );

      addMockPinSysMessage(PIN_OPERATION_TYPE_ENUM.UnPin, message);

      initList();
    },
    [addMockPinSysMessage, channelId, dispatch, initList, networkType, refreshLastPin],
  );

  const unPinAll = useCallback(async () => {
    const fetchTime = Date.now();
    await im.service.unPinAll({
      channelUuid: channelId,
    });

    addMockPinSysMessage(PIN_OPERATION_TYPE_ENUM.RemoveAll);

    dispatch(
      cleanALLChannelMessagePin({
        network: networkType,
        channelId: channelId,
      }),
    );
    dispatch(
      setLastPinMessage({
        network: networkType,
        channelId: channelId,
        message: undefined,
        fetchTime,
      }),
    );
    dispatch(
      setPinList({
        network: networkType,
        channelId: channelId,
        list: [],
        fetchTime: fetchTime,
      }),
    );
  }, [addMockPinSysMessage, channelId, dispatch, networkType]);

  return {
    list,
    lastPinMessage,
    initList,
    refresh,
    refreshLastPin,
    pin,
    unPin,
    unPinAll,
    addMockPinSysMessage,
  };
};

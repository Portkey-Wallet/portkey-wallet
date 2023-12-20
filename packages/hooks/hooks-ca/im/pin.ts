import { useCallback, useMemo, useRef } from 'react';
import { useIMLastPinNetMapState, useIMPinListNetMapState } from '.';
import { useCurrentNetworkInfo } from '../network';
import im, { Message, SocketMessage } from '@portkey-wallet/im';
import { PIN_MESSAGE_LIST_LIMIT } from '@portkey-wallet/constants/constants-ca/im';
import { useAppCommonDispatch, useEffectOnce } from '../../index';
import {
  addChannelMessage,
  nextPinList,
  setLastPinMessage,
  setPinList,
  updateChannelAttribute,
  updateChannelMessageAttribute,
} from '@portkey-wallet/store/store-ca/im/actions';
import { IM_PIN_LIST_SORT_TYPE_ENUM } from '@portkey-wallet/im/constant';
import { randomId } from '@portkey-wallet/utils';

export const useIMPin = (channelId: string, isRegister = false) => {
  const { networkType } = useCurrentNetworkInfo();
  const dispatch = useAppCommonDispatch();

  const pinListNetMap = useIMPinListNetMapState();
  const list = useMemo(
    () => pinListNetMap?.[networkType]?.[channelId]?.list || [],
    [channelId, networkType, pinListNetMap],
  );

  const LastPinNetMap = useIMLastPinNetMapState();
  const lastPinMessage: Message | undefined = useMemo(
    () => LastPinNetMap?.[networkType]?.[channelId]?.message,
    [LastPinNetMap, channelId, networkType],
  );
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
          data: { items, totalCount },
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

        if (skipCount === 0) {
          dispatch(
            setPinList({
              network: networkType,
              channelId: channelId,
              list: items,
              fetchTime: fetchTime,
            }),
          );
        } else {
          dispatch(
            nextPinList({
              network: networkType,
              channelId: channelId,
              list: items,
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
        data: { items: pinList },
      } = await im.service.getPinList({
        channelUuid: channelId,
        sortType: IM_PIN_LIST_SORT_TYPE_ENUM.Pin,
        ascending: true,
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

  const handlePinSystemMsg = useCallback((e: SocketMessage) => {
    // TODO: 1.4.13
    if (e.type !== 'PIN-SYS') return;
    refreshRef.current();
  }, []);
  const handlePinSystemMsgRef = useRef(handlePinSystemMsg);
  handlePinSystemMsgRef.current = handlePinSystemMsg;

  useEffectOnce(() => {
    if (!isRegister) return;
    const { remove: removeMsgObserver } = im.registerChannelMsgObserver(channelId, (e: SocketMessage) => {
      handlePinSystemMsgRef.current(e);
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

  // TODO: 1.4.13 add mock pin system msg
  const addMockPinSysMessage = useCallback(
    (type: string, message?: Message) => {
      const createAt = `${Date.now()}`;
      const uuid = randomId();
      const pinSysMessage: Message = {
        channelUuid: channelId,
        sendUuid: `${channelId}-${Date.now()}-${uuid}`,
        type: 'PIN-SYS',
        content: '',
        createAt,
        from: '',
      };

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
            lastMessageType: 'PIN-SYS',
            lastMessageContent: pinSysMessage.content, //TODO: 1.4.13 parse
            lastPostAt: createAt,
          },
        }),
      );
    },
    [channelId, dispatch, networkType],
  );

  const pin = useCallback(
    async (message: Message) => {
      if (!message.id) throw new Error('message id is null');
      delete message.parsedContent;
      delete message.unidentified;
      delete message.pinInfo;
      if (message.quote) {
        delete message.quote.parsedContent;
        delete message.quote.unidentified;
        delete message.quote.pinInfo;
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
      initList();

      const createAt = `${Date.now()}`;
      const pinInfo = {
        pinner: '',
        pinnerName: '',
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

      // TODO: 1.4.3 add pin system msg
      addMockPinSysMessage('', message);
    },
    [addMockPinSysMessage, channelId, dispatch, initList, networkType],
  );

  const unPin = useCallback(
    async (message: Message) => {
      const { id } = message;
      if (!id) return;
      await im.service.unPin({
        channelUuid: channelId,
        id,
      });
      if (lastPinMessageRef.current?.id === id) {
        refreshLastPin();
      }
      initList();

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
      // TODO: 1.4.3 add pin system msg
      addMockPinSysMessage('', message);
    },
    [addMockPinSysMessage, channelId, dispatch, initList, networkType, refreshLastPin],
  );

  const unPinAll = useCallback(async () => {
    const fetchTime = Date.now();
    try {
      //TODO: 1.4.3 add removeALL
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
      // TODO: 1.4.3 add pin system msg
      addMockPinSysMessage('');
    } catch (error) {
      //
    }
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

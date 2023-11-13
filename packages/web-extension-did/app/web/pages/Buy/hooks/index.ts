import { IGetRampDetailRequest, RampType } from '@portkey-wallet/ramp';
import { getBuyPrice, getSellPrice } from '@portkey-wallet/utils/ramp';
import { useCallback, useMemo, useRef, useState } from 'react';
import { MAX_UPDATE_TIME } from '../const';
import { INSUFFICIENT_FUNDS_TEXT, SYNCHRONIZING_CHAIN_TEXT } from '@portkey-wallet/constants/constants-ca/payment';
import { useEffectOnce } from 'react-use';
import { limitText, validValueCheck } from '../utils';
import { IBuyErrMsgHandlerParams, ISellErrMsgHandlerParams } from '../types';
import { useCheckManagerSyncState } from 'hooks/wallet';

export const useUpdateReceiveAndInterval = (type: RampType) => {
  const checkManagerSyncState = useCheckManagerSyncState();

  const [receive, setReceive] = useState<string>('');
  const [exchange, setExchange] = useState<string>('');
  const [errMsg, setErrMsg] = useState<string>('');
  const [warningMsg, setWarningMsg] = useState<string>('');
  // const isShowMsg = useRef<boolean>(false);
  const [updateTime, setUpdateTime] = useState(MAX_UPDATE_TIME);
  const updateTimeRef = useRef(MAX_UPDATE_TIME);
  const updateTimerRef = useRef<NodeJS.Timer | number>();

  const { updateBuyReceive, updateSellReceive, handleSetTimer, stopInterval, resetTimer } = useMemo(() => {
    const updateBuyReceive = async (params: IGetRampDetailRequest) => {
      try {
        const { network, crypto, fiatAmount: fiatAmountInput, fiat, country } = params;
        const { cryptoAmount, exchange } = await getBuyPrice({
          network,
          crypto,
          fiatAmount: fiatAmountInput,
          fiat,
          country,
        });
        // if (params.amount !== valueSaveRef.current.amount) return;

        setExchange(exchange);
        setReceive(cryptoAmount);
        setErrMsg('');
        setWarningMsg('');

        if (!updateTimerRef.current) {
          resetTimer(params);
        }
      } catch (error) {
        console.log('getBuyPrice error:', error);
      }
    };

    const updateSellReceive = async (params: IGetRampDetailRequest) => {
      try {
        const { network, crypto, cryptoAmount: cryptoAmountInput, fiat, country } = params;
        const { fiatAmount, exchange } = await getSellPrice({
          network,
          crypto,
          cryptoAmount: cryptoAmountInput,
          fiat,
          country,
        });
        // if (params.amount !== valueSaveRef.current.amount) return;

        setExchange(exchange);
        setReceive(fiatAmount);
        setErrMsg('');
        setWarningMsg('');
        // isShowMsg.current = false;

        if (!updateTimerRef.current) {
          resetTimer(params);
        }
      } catch (error) {
        console.log('getSellPrice error:', error);
      }
    };

    const handleSetTimer = (params: IGetRampDetailRequest) => {
      updateTimerRef.current = setInterval(() => {
        --updateTimeRef.current;

        if (updateTimeRef.current === 0) {
          type === RampType.BUY ? updateBuyReceive(params) : updateSellReceive(params);
          updateTimeRef.current = MAX_UPDATE_TIME;
        }

        setUpdateTime(updateTimeRef.current);
      }, 1000);
    };

    const stopInterval = () => {
      clearInterval(updateTimerRef.current);
      updateTimerRef.current = undefined;
      setExchange('');
    };

    const resetTimer = (params: IGetRampDetailRequest) => {
      clearInterval(updateTimerRef.current);
      updateTimerRef.current = undefined;
      updateTimeRef.current = MAX_UPDATE_TIME;
      setUpdateTime(MAX_UPDATE_TIME);
      handleSetTimer(params);
    };

    return { updateBuyReceive, updateSellReceive, handleSetTimer, stopInterval, resetTimer };
  }, [type]);

  const buyErrMsgHandler = useCallback(
    ({ min, max, fiat, fiatAmount }: IBuyErrMsgHandlerParams) => {
      if (min !== null && max !== null) {
        if (!validValueCheck({ amount: fiatAmount, min, max })) {
          stopInterval();
          setErrMsg(limitText({ symbol: fiat, min, max }));
          // isShowMsg.current = true;
        } else {
          // isShowMsg.current = false;
          setReceive('');
        }
      }
    },
    [stopInterval],
  );

  const sellErrMsgHandler = useCallback(
    ({ min, max, crypto, cryptoAmount }: ISellErrMsgHandlerParams) => {
      if (min !== null && max !== null) {
        if (!validValueCheck({ amount: cryptoAmount, min, max })) {
          stopInterval();
          setErrMsg(limitText({ symbol: crypto, min, max }));
          // isShowMsg.current = true;
        } else {
          // isShowMsg.current = false;
          setReceive('');
        }
      }
    },
    [stopInterval],
  );

  const setInsufficientFundsMsg = useCallback(() => {
    stopInterval();

    setErrMsg(INSUFFICIENT_FUNDS_TEXT);
    // isShowMsg.current = true;

    setReceive('');
  }, [stopInterval]);

  const checkManagerSynced = useCallback(async () => {
    const _isManagerSynced = await checkManagerSyncState('AELF');

    if (!_isManagerSynced) {
      setWarningMsg(SYNCHRONIZING_CHAIN_TEXT);
      // isShowMsg.current = true;
    } else {
      setWarningMsg('');
    }
    return _isManagerSynced;
  }, [checkManagerSyncState]);

  useEffectOnce(() => {
    return () => {
      stopInterval();
    };
  });

  return {
    receive,
    exchange,
    errMsg,
    warningMsg,
    updateTime,
    updateBuyReceive,
    updateSellReceive,
    buyErrMsgHandler,
    sellErrMsgHandler,
    handleSetTimer,
    stopInterval,
    resetTimer,
    setInsufficientFundsMsg,
    checkManagerSynced,
  };
};

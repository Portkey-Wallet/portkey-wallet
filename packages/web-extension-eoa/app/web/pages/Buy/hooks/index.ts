import { IRampCryptoItem, IRampFiatItem, RampType } from '@portkey-wallet/ramp';
import { getBuyLimit, getBuyPrice, getSellLimit, getSellPrice } from '@portkey-wallet/utils/ramp';
import { MutableRefObject, useCallback, useMemo, useRef, useState } from 'react';
import { MAX_UPDATE_TIME } from '../const';
import { INSUFFICIENT_FUNDS_TEXT, SYNCHRONIZING_CHAIN_TEXT } from '@portkey-wallet/constants/constants-ca/ramp';
import { useEffectOnce } from 'react-use';
import { limitText, validValueCheck } from '../utils';
import { IErrMsgHandlerParams } from '../types';
import { useCheckManagerSyncState } from 'hooks/wallet';
import { formatAmountShow } from '@portkey-wallet/utils/converter';
import { MAIN_CHAIN_ID } from '@portkey-wallet/constants/constants-ca/activity';

interface IUpdateReceiveAndIntervalProps {
  cryptoSelectedRef: MutableRefObject<IRampCryptoItem>;
  fiatSelectedRef: MutableRefObject<IRampFiatItem>;
  fiatAmountRef?: MutableRefObject<string>;
  cryptoAmountRef?: MutableRefObject<string>;
}

export const useUpdateReceiveAndInterval = (type: RampType, params: IUpdateReceiveAndIntervalProps) => {
  const checkManagerSyncState = useCheckManagerSyncState();

  const [receive, setReceive] = useState<string>('');
  const [exchange, setExchange] = useState<string>('');
  const [errMsg, setErrMsg] = useState<string>('');
  const [warningMsg, setWarningMsg] = useState<string>('');
  // const isShowMsg = useRef<boolean>(false);
  const [updateTime, setUpdateTime] = useState(MAX_UPDATE_TIME);
  const updateTimeRef = useRef(MAX_UPDATE_TIME);
  const updateTimerRef = useRef<NodeJS.Timer | number>();
  const isShowErrorRef = useRef(false);

  const { updateBuyReceive, updateSellReceive, handleSetTimer, stopInterval, resetTimer } = useMemo(() => {
    const updateBuyReceive = async () => {
      try {
        const { cryptoSelectedRef, fiatSelectedRef, fiatAmountRef } = params;
        if (!fiatAmountRef?.current) {
          setReceive('');
          setErrMsg('');
          setWarningMsg('');
          stopInterval();
          return;
        }

        await checkBuyLimit();

        const { cryptoAmount, exchange } = await getBuyPrice({
          network: cryptoSelectedRef.current.network,
          crypto: cryptoSelectedRef.current.symbol,
          fiatAmount: fiatAmountRef.current,
          fiat: fiatSelectedRef.current.symbol,
          country: fiatSelectedRef.current.country,
        });

        setExchange(exchange);
        if (isShowErrorRef.current) return;
        setReceive(formatAmountShow(Number(cryptoAmount), 4));

        if (!updateTimerRef.current) {
          resetTimer();
        }
      } catch (error) {
        setReceive('');
        console.log('updateBuyReceive error:', error);
      }
    };

    const updateSellReceive = async () => {
      try {
        const { cryptoSelectedRef, fiatSelectedRef, cryptoAmountRef } = params;
        if (!cryptoAmountRef?.current) {
          setReceive('');
          setErrMsg('');
          setWarningMsg('');
          stopInterval();
          return;
        }

        await checkSellLimit();

        const { fiatAmount, exchange } = await getSellPrice({
          network: cryptoSelectedRef.current.network,
          crypto: cryptoSelectedRef.current.symbol,
          cryptoAmount: cryptoAmountRef.current,
          fiat: fiatSelectedRef.current.symbol,
          country: fiatSelectedRef.current.country,
        });

        setExchange(exchange);
        if (isShowErrorRef.current) return;
        setReceive(formatAmountShow(Number(fiatAmount), 4));

        if (!updateTimerRef.current) {
          resetTimer();
        }
      } catch (error) {
        setReceive('');
        console.log('updateSellReceive error:', error);
      }
    };

    const errMsgHandler = ({ min, max, symbol, amount }: IErrMsgHandlerParams) => {
      if (min !== null && max !== null) {
        if (!validValueCheck({ amount, min, max })) {
          setReceive('');
          stopInterval();
          setErrMsg(limitText({ symbol, min, max }));
          setWarningMsg('');
          isShowErrorRef.current = true;
        } else {
          setErrMsg('');
          setWarningMsg('');
          isShowErrorRef.current = false;
        }
      }
    };

    const checkBuyLimit = async () => {
      const { cryptoSelectedRef, fiatSelectedRef, fiatAmountRef } = params;
      const { minLimit, maxLimit } = await getBuyLimit({
        crypto: cryptoSelectedRef.current.symbol,
        network: cryptoSelectedRef.current.network,
        fiat: fiatSelectedRef.current.symbol,
        country: fiatSelectedRef.current.country,
      });

      errMsgHandler({
        symbol: fiatSelectedRef.current.symbol,
        amount: fiatAmountRef?.current || '',
        min: minLimit,
        max: maxLimit,
      });
    };

    const checkSellLimit = async () => {
      const { cryptoSelectedRef, fiatSelectedRef, cryptoAmountRef } = params;
      const { minLimit, maxLimit } = await getSellLimit({
        crypto: cryptoSelectedRef.current.symbol,
        network: cryptoSelectedRef.current.network,
        fiat: fiatSelectedRef.current.symbol,
        country: fiatSelectedRef.current.country,
      });

      errMsgHandler({
        symbol: cryptoSelectedRef.current.symbol,
        amount: cryptoAmountRef?.current || '',
        min: minLimit,
        max: maxLimit,
      });
    };

    const handleSetTimer = () => {
      updateTimerRef.current = setInterval(() => {
        --updateTimeRef.current;

        if (updateTimeRef.current === 0) {
          type === RampType.BUY ? updateBuyReceive() : updateSellReceive();
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

    const resetTimer = () => {
      clearInterval(updateTimerRef.current);
      updateTimerRef.current = undefined;
      updateTimeRef.current = MAX_UPDATE_TIME;
      setUpdateTime(MAX_UPDATE_TIME);
      handleSetTimer();
    };

    return { updateBuyReceive, updateSellReceive, handleSetTimer, stopInterval, resetTimer };
  }, [params, type]);

  const setInsufficientFundsMsg = useCallback(() => {
    stopInterval();

    setErrMsg(INSUFFICIENT_FUNDS_TEXT);
    // isShowMsg.current = true;

    setReceive('');
  }, [stopInterval]);

  const checkManagerSynced = useCallback(async () => {
    const _isManagerSynced = await checkManagerSyncState(MAIN_CHAIN_ID);

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
    setReceive,
    exchange,
    errMsg,
    warningMsg,
    updateTime,
    updateBuyReceive,
    updateSellReceive,
    handleSetTimer,
    stopInterval,
    resetTimer,
    setInsufficientFundsMsg,
    checkManagerSynced,
  };
};

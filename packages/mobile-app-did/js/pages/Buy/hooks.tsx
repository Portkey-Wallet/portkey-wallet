import { FiatType } from '@portkey-wallet/store/store-ca/payment/type';
import { CryptoItemType, LimitType, TypeEnum } from './types';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { MAX_REFRESH_TIME } from './constants';
import useEffectOnce from 'hooks/useEffectOnce';
import { GetOrderQuoteParamsType, getOrderQuote } from '@portkey-wallet/api/api-did/payment/util';
import { formatAmountShow } from '@portkey-wallet/utils/converter';
import CommonToast from 'components/CommonToast';
import { ErrorType } from 'types/common';
import { INIT_HAS_ERROR, INIT_NONE_ERROR } from 'constants/common';
import isEqual from 'lodash/isEqual';
import { useIsFocused } from '@react-navigation/native';

export const useReceive = (
  type: TypeEnum,
  amount: string,
  fiat?: FiatType,
  token?: CryptoItemType,
  initialReceiveAmount = '',
  initialRate = '',
  limitAmountRef?: React.MutableRefObject<LimitType | undefined>,
  isRefreshReceiveValid?: React.MutableRefObject<boolean>,
) => {
  const [receiveAmount, setReceiveAmount] = useState<string>(initialReceiveAmount);
  const [rate, setRate] = useState<string>(initialRate);
  const rateRefreshTimeRef = useRef(MAX_REFRESH_TIME);
  const [rateRefreshTime, setRateRefreshTime] = useState<number>(MAX_REFRESH_TIME);
  const refreshReceiveRef = useRef<() => void>();
  const refreshReceiveTimerRef = useRef<NodeJS.Timer>();
  const isFocused = useIsFocused();
  const isFocusedRef = useRef(isFocused);
  isFocusedRef.current = isFocused;

  const [amountError, setAmountError] = useState<ErrorType>(INIT_NONE_ERROR);

  const isAllowAmount = useMemo(() => {
    const reg = /^\d+(\.\d+)?$/;
    if (amount === '' || !reg.test(amount)) return false;
    return true;
  }, [amount]);

  const clearRefreshReceive = useCallback(() => {
    refreshReceiveTimerRef.current && clearInterval(refreshReceiveTimerRef.current);
    refreshReceiveTimerRef.current = undefined;
  }, []);

  useEffectOnce(() => {
    return () => {
      clearRefreshReceive();
    };
  });

  const registerRefreshReceive = useCallback(() => {
    clearRefreshReceive();

    if (!isFocusedRef.current) return;

    rateRefreshTimeRef.current = MAX_REFRESH_TIME;
    setRateRefreshTime(MAX_REFRESH_TIME);

    const timer = setInterval(() => {
      rateRefreshTimeRef.current = --rateRefreshTimeRef.current;
      if (rateRefreshTimeRef.current === 0) {
        refreshReceiveRef.current?.();
        rateRefreshTimeRef.current = MAX_REFRESH_TIME;
      }
      setRateRefreshTime(rateRefreshTimeRef.current);
    }, 1000);

    refreshReceiveTimerRef.current = timer;
  }, [clearRefreshReceive]);

  const lastParams = useRef<GetOrderQuoteParamsType>();
  const refreshReceive = useCallback(async () => {
    if (fiat === undefined || token === undefined || !isAllowAmount) return;

    if (limitAmountRef) {
      if (limitAmountRef.current === undefined) return;
      const { min, max } = limitAmountRef.current;
      const amountNum = Number(amount);

      if (amountNum < min || amountNum > max) {
        setAmountError({
          ...INIT_HAS_ERROR,
          errorMsg: `Limit Amount ${formatAmountShow(min)}-${formatAmountShow(max)} ${fiat?.currency}`,
        });
        setRate('');
        setReceiveAmount('');
        clearRefreshReceive();
        return;
      }
    }

    const params = {
      crypto: token.crypto,
      network: token.network,
      fiat: fiat.currency,
      country: fiat.country,
      amount,
      side: type === TypeEnum.BUY ? 'BUY' : 'SELL',
    };
    lastParams.current = params;

    try {
      const rst = await getOrderQuote(params);

      if (refreshReceiveTimerRef.current === undefined) {
        registerRefreshReceive();
      }

      if (!isEqual(params, lastParams.current)) return;
      if (
        !rst ||
        !rst.cryptoPrice ||
        (type === TypeEnum.BUY && !rst.cryptoQuantity) ||
        (type === TypeEnum.SELL && !rst.fiatQuantity)
      ) {
        setRate('');
        setReceiveAmount('');
        return;
      }

      if (isRefreshReceiveValid) isRefreshReceiveValid.current = true;

      const _rate = Number(rst.cryptoPrice).toFixed(2) + '';
      const _receiveAmount = formatAmountShow((type === TypeEnum.BUY ? rst.cryptoQuantity : rst.fiatQuantity) || '', 4);
      setRate(_rate);
      setReceiveAmount(_receiveAmount);
      return {
        rate: _rate,
        receiveAmount: _receiveAmount,
      };
    } catch (error) {
      console.log('error', error);
      CommonToast.failError(error);
    }
  }, [
    amount,
    clearRefreshReceive,
    fiat,
    isAllowAmount,
    isRefreshReceiveValid,
    limitAmountRef,
    registerRefreshReceive,
    token,
    type,
  ]);
  refreshReceiveRef.current = refreshReceive;

  const timer = useRef<NodeJS.Timeout>();
  const debounceRefreshReceiveRef = useRef<() => void>();
  const debounceRefreshReceive = useCallback(() => {
    if (timer.current !== undefined) return;
    timer.current = setTimeout(() => {
      refreshReceiveRef.current?.();
      timer.current = undefined;
    }, 500);
  }, []);
  debounceRefreshReceiveRef.current = debounceRefreshReceive;

  useEffect(() => {
    setAmountError(INIT_NONE_ERROR);
    debounceRefreshReceiveRef.current?.();
  }, [amount]);

  return { receiveAmount, rate, rateRefreshTime, refreshReceive, amountError, isAllowAmount };
};

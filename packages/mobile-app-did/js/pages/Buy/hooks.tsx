import { FiatType } from '@portkey-wallet/store/store-ca/payment/type';
import { CryptoItemType } from './types';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { MAX_REFRESH_TIME } from './constants';
import useEffectOnce from 'hooks/useEffectOnce';
import { GetOrderQuoteParamsType, getOrderQuote } from '@portkey-wallet/api/api-did/payment/util';
import { formatAmountShow } from '@portkey-wallet/utils/converter';
import { ErrorType } from 'types/common';
import { INIT_HAS_ERROR, INIT_NONE_ERROR } from 'constants/common';
import isEqual from 'lodash/isEqual';
import { ZERO } from '@portkey-wallet/constants/misc';
import { PaymentLimitType, PaymentTypeEnum } from '@portkey-wallet/types/types-ca/payment';

export const useReceive = (
  type: PaymentTypeEnum,
  amount: string,
  fiat?: FiatType,
  token?: CryptoItemType,
  initialReceiveAmount = '',
  initialRate = '',
  limitAmountRef?: React.MutableRefObject<PaymentLimitType | undefined>,
  isRefreshReceiveValid?: React.MutableRefObject<boolean>,
) => {
  const [receiveAmount, setReceiveAmount] = useState<string>(initialReceiveAmount);
  const [rate, setRate] = useState<string>(initialRate);
  const rateRefreshTimeRef = useRef(MAX_REFRESH_TIME);
  const [rateRefreshTime, setRateRefreshTime] = useState<number>(MAX_REFRESH_TIME);
  const refreshReceiveRef = useRef<() => void>();
  const refreshReceiveTimerRef = useRef<NodeJS.Timer>();
  const isFocusedRef = useRef(false);

  const [amountError, setAmountError] = useState<ErrorType>(INIT_NONE_ERROR);

  const isAllowAmountRef = useRef(false);
  isAllowAmountRef.current = useMemo(() => {
    const reg = /^\d+(\.\d+)?$/;
    if (amount === '' || !reg.test(amount)) return false;
    return true;
  }, [amount]);

  const clearRefreshReceive = useCallback(() => {
    refreshReceiveTimerRef.current && clearInterval(refreshReceiveTimerRef.current);
    refreshReceiveTimerRef.current = undefined;
  }, []);

  useEffectOnce(() => {
    isFocusedRef.current = true;
    return () => {
      isFocusedRef.current = false;
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
    if (amount === '') {
      setRate('');
      setReceiveAmount('');
      clearRefreshReceive();
      return;
    }

    if (fiat === undefined || token === undefined || !isAllowAmountRef.current) return;

    if (limitAmountRef) {
      if (limitAmountRef.current === undefined) return;
      const { min, max } = limitAmountRef.current;
      const amountNum = Number(amount);

      if (amountNum < min || amountNum > max) {
        setAmountError({
          ...INIT_HAS_ERROR,
          errorMsg: `Limit Amount ${formatAmountShow(min, 4)}-${formatAmountShow(max, 4)} ${
            type === PaymentTypeEnum.BUY ? fiat?.currency : token.crypto
          }`,
        });
        setRate('');
        setReceiveAmount('');
        clearRefreshReceive();
        return;
      } else {
        setAmountError(INIT_NONE_ERROR);
      }
    }

    const params = {
      crypto: token.crypto,
      network: token.network,
      fiat: fiat.currency,
      country: fiat.country,
      amount,
      side: type === PaymentTypeEnum.BUY ? 'BUY' : 'SELL',
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
        (type === PaymentTypeEnum.BUY && !rst.cryptoQuantity) ||
        (type === PaymentTypeEnum.SELL && !rst.fiatQuantity)
      ) {
        setRate('');
        setReceiveAmount('');
        return;
      }

      if (isRefreshReceiveValid) isRefreshReceiveValid.current = true;
      const _rate = Number(rst.cryptoPrice).toFixed(2) + '';
      let _receiveAmount = '';
      if (type === PaymentTypeEnum.BUY) {
        _receiveAmount = formatAmountShow(rst.cryptoQuantity || '', 4);
      } else {
        const fiatQuantity = ZERO.plus(rst.fiatQuantity || 0).minus(rst.rampFee || 0);
        _receiveAmount = formatAmountShow(fiatQuantity.valueOf(), 4);
      }

      setRate(_rate);
      setReceiveAmount(_receiveAmount);
      return {
        rate: _rate,
        receiveAmount: _receiveAmount,
      };
    } catch (error) {
      console.log('error', error);
    }
  }, [amount, clearRefreshReceive, fiat, isRefreshReceiveValid, limitAmountRef, registerRefreshReceive, token, type]);
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

  useEffect(() => {
    if (!isAllowAmountRef.current) {
      setReceiveAmount('');
    }
  }, [fiat, token]);

  return { receiveAmount, rate, rateRefreshTime, refreshReceive, amountError, isAllowAmount: isAllowAmountRef.current };
};

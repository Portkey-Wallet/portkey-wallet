import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { MAX_REFRESH_TIME } from './constants';
import { formatAmountShow } from '@portkey-wallet/utils/converter';
import { ErrorType, INIT_HAS_ERROR, INIT_NONE_ERROR } from '@portkey-wallet/constants/constants-ca/common';
import isEqual from 'lodash/isEqual';
import {
  IBuyPriceResult,
  IBuyProviderPrice,
  IGetBuyDetailRequest,
  IGetSellDetailRequest,
  IRampCryptoItem,
  IRampFiatItem,
  ISellPriceResult,
  ISellProviderPrice,
  RampType,
} from '@portkey-wallet/ramp';
import { IRampLimit } from '@portkey-wallet/types/types-ca/ramp';
import { getBuyDetail, getBuyPrice, getSellDetail, getSellPrice } from '@portkey-wallet/utils/ramp';

export interface UseReceiveParams {
  type: RampType;
  amount: string;
  fiat?: IRampFiatItem;
  crypto?: IRampCryptoItem;
  initialReceiveAmount?: string;
  initialRate?: string;
  limitAmountRef?: React.MutableRefObject<IRampLimit | undefined>;
  isRefreshReceiveValid?: React.MutableRefObject<boolean>;
  isProviderShow?: boolean;
}

export const useReceive = ({
  type,
  amount,
  fiat,
  crypto,
  initialReceiveAmount = '',
  initialRate = '',
  limitAmountRef,
  isRefreshReceiveValid,
  isProviderShow = false,
}: UseReceiveParams) => {
  const [receiveAmount, setReceiveAmount] = useState<string>(initialReceiveAmount);
  const [rate, setRate] = useState<string>(initialRate);
  const rateRefreshTimeRef = useRef(MAX_REFRESH_TIME);
  const [rateRefreshTime, setRateRefreshTime] = useState<number>(MAX_REFRESH_TIME);
  const refreshReceiveRef = useRef<() => void>();
  const refreshReceiveTimerRef = useRef<NodeJS.Timeout>();
  const isFocusedRef = useRef(false);

  const [providerPriceList, setProviderPriceList] = useState<IBuyProviderPrice[] | ISellProviderPrice[]>([]);

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

  useEffect(() => {
    isFocusedRef.current = true;
    return () => {
      isFocusedRef.current = false;
      clearRefreshReceive();
    };
  }, [clearRefreshReceive]);

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

  const lastParams = useRef<IGetBuyDetailRequest | IGetSellDetailRequest>();
  const refreshReceive = useCallback(async () => {
    if (amount === '') {
      setRate('');
      setReceiveAmount('');
      clearRefreshReceive();
      return;
    }

    if (fiat === undefined || crypto === undefined || !isAllowAmountRef.current) return;

    if (limitAmountRef) {
      if (limitAmountRef.current === undefined) return;
      const { minLimit, maxLimit } = limitAmountRef.current;
      const amountNum = Number(amount);

      if (amountNum < minLimit || amountNum > maxLimit) {
        setAmountError({
          ...INIT_HAS_ERROR,
          errorMsg: `Limit Amount ${formatAmountShow(minLimit, 4)}-${formatAmountShow(maxLimit, 4)} ${
            type === RampType.BUY ? fiat.symbol : crypto.symbol
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

    let params: IGetBuyDetailRequest | IGetSellDetailRequest;
    let rst: IBuyPriceResult | ISellPriceResult | undefined;
    let providerRst: IBuyProviderPrice[] | ISellProviderPrice[] = [];
    try {
      if (type === RampType.BUY) {
        params = {
          crypto: crypto.symbol,
          network: crypto.network,
          fiat: fiat.symbol,
          country: fiat.country,
          fiatAmount: amount,
        };
        lastParams.current = params;
        if (isProviderShow) {
          providerRst = await getBuyDetail(params);
        } else {
          rst = await getBuyPrice(params);
        }
      } else {
        params = {
          crypto: crypto.symbol,
          network: crypto.network,
          fiat: fiat.symbol,
          country: fiat.country,
          cryptoAmount: amount,
        };
        lastParams.current = params;

        if (isProviderShow) {
          providerRst = await getSellDetail(params);
        } else {
          rst = await getSellPrice(params);
        }
      }

      if (refreshReceiveTimerRef.current === undefined) {
        registerRefreshReceive();
      }

      if (!isFocusedRef.current) return;
      if (!isEqual(params, lastParams.current)) return;

      if (isRefreshReceiveValid) isRefreshReceiveValid.current = true;

      let _rate = '';
      let _receiveAmount = '';
      if (isProviderShow) {
        if (!providerRst || !Array.isArray(providerRst)) {
          setRate('');
          setReceiveAmount('');
          setProviderPriceList([]);
          return;
        }
        _rate = formatAmountShow(providerRst[0]?.exchange || '', 2);
        if (type === RampType.BUY) {
          providerRst = providerRst.map(item => ({
            ...item,
            exchange: formatAmountShow(item.exchange || '', 2),
            cryptoAmount: formatAmountShow((item as IBuyProviderPrice).cryptoAmount || '', 4),
          }));
          _receiveAmount = formatAmountShow(providerRst[0]?.cryptoAmount || '', 4);
        } else {
          providerRst = providerRst.map(item => ({
            ...item,
            exchange: formatAmountShow(item.exchange || '', 2),
            fiatAmount: formatAmountShow((item as ISellProviderPrice).fiatAmount || '', 4),
          }));

          _receiveAmount = formatAmountShow(providerRst[0]?.fiatAmount || '', 4);
        }
        setRate(_rate);
        setReceiveAmount(_receiveAmount);
        setProviderPriceList(providerRst);
      } else {
        if (
          !rst ||
          !rst.exchange ||
          (type === RampType.BUY && !(rst as IBuyPriceResult).cryptoAmount) ||
          (type === RampType.SELL && !(rst as ISellPriceResult).fiatAmount)
        ) {
          setRate('');
          setReceiveAmount('');
          return;
        }

        _rate = formatAmountShow(rst.exchange, 2);
        if (type === RampType.BUY) {
          _receiveAmount = formatAmountShow((rst as IBuyPriceResult).cryptoAmount || '', 4);
        } else {
          _receiveAmount = formatAmountShow((rst as ISellPriceResult).fiatAmount, 4);
        }
        setRate(_rate);
        setReceiveAmount(_receiveAmount);
      }

      return {
        rate: _rate,
        receiveAmount: _receiveAmount,
        providerPriceList: providerRst,
      };
    } catch (error) {
      console.log('error', error);
    }
  }, [
    amount,
    fiat,
    crypto,
    limitAmountRef,
    clearRefreshReceive,
    type,
    isRefreshReceiveValid,
    isProviderShow,
    registerRefreshReceive,
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

  const isResponseInputRef = useRef(false);
  useEffect(() => {
    setAmountError(INIT_NONE_ERROR);
    if (isResponseInputRef.current) {
      debounceRefreshReceiveRef.current?.();
    } else {
      isResponseInputRef.current = true;
    }
  }, [amount]);

  useEffect(() => {
    if (!isAllowAmountRef.current) {
      setReceiveAmount('');
    }
  }, [fiat, crypto]);

  return {
    receiveAmount,
    rate,
    providerPriceList,
    rateRefreshTime,
    refreshReceive,
    amountError,
    isAllowAmount: isAllowAmountRef.current,
  };
};

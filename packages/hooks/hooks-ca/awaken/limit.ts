import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useGetPairReserve } from '@portkey-wallet/graphql/awaken/hooks';
import { ZERO } from '@portkey-wallet/constants/misc';
import { useReturnLastCallback } from '../../index';
import { LIMIT_TIME_INTERVAL } from '@portkey-wallet/constants/awaken/limit';
import { useDAppChainId } from '../chainList';

export type TReserveInfo = {
  reserveIn: string;
  reserveOut: string;
};

export const useGetPairMaxReserve = () => {
  const getPairReserve = useGetPairReserve();
  const dAppChainId = useDAppChainId();

  return useCallback(
    async (symbolIn: string, symbolOut: string): Promise<TReserveInfo> => {
      const {
        data: {
          pairReserve: { syncRecords },
        },
      } = await getPairReserve({
        dto: {
          chainId: dAppChainId,
          symbolA: symbolIn,
          symbolB: symbolOut,
        },
      });
      let reserveIn = '0',
        reserveOut = '0',
        maxReserveProduct = ZERO;
      console.log('useGetPairMaxReserve', syncRecords);

      syncRecords.forEach(item => {
        const reserveProduct = ZERO.plus(item.reserveA).times(item.reserveB);
        if (reserveProduct.lte(maxReserveProduct)) return;
        maxReserveProduct = reserveProduct;
        if (item.symbolA === symbolIn) {
          reserveIn = item.reserveA;
          reserveOut = item.reserveB;
        } else {
          reserveIn = item.reserveB;
          reserveOut = item.reserveA;
        }
      });

      return {
        reserveIn,
        reserveOut,
      };
    },
    [dAppChainId, getPairReserve],
  );
};

export const usePairMaxReserve = (symbolIn?: string, symbolOut?: string) => {
  const _getPairMaxReserve = useGetPairMaxReserve();
  const getPairMaxReserve = useReturnLastCallback(_getPairMaxReserve, [_getPairMaxReserve]);
  const [maxReserveMap, setMaxReserve] = useState<Record<string, TReserveInfo>>({});
  const key = useMemo(() => {
    const isReverse = (symbolOut || '') > (symbolIn || '');
    if (isReverse) return `${symbolOut}_${symbolIn}`;
    return `${symbolIn}_${symbolOut}`;
  }, [symbolIn, symbolOut]);

  const refresh = useCallback(async () => {
    const [tokenA, tokenB] = key.split('_');
    if (!tokenA || !tokenB) return;
    const result = await getPairMaxReserve(tokenA, tokenB);
    setMaxReserve(pre => ({
      ...pre,
      [key]: result,
    }));
  }, [getPairMaxReserve, key]);

  const [isError, setIsError] = useState(false);
  const executeCb = useCallback(async () => {
    try {
      await refresh();
      setIsError(false);
    } catch (error: any) {
      console.log('usePairMaxReserve error', error);

      if (error.name === 'ApolloError') {
        setIsError(true);
      }
    }
  }, [refresh]);
  const executeCbRef = useRef(executeCb);
  executeCbRef.current = executeCb;

  const timerRef = useRef<NodeJS.Timeout>();
  const clearTimer = useCallback(() => {
    if (!timerRef.current) return;
    clearInterval(timerRef.current);
    timerRef.current = undefined;
    console.log('usePairMaxReserve clearTimer');
  }, []);

  const registerTimer = useCallback(() => {
    clearTimer();
    if (key === '_') return;
    setIsError(false);
    executeCbRef.current();
    timerRef.current = setInterval(() => {
      executeCbRef.current();
    }, LIMIT_TIME_INTERVAL);
  }, [clearTimer, key]);

  useEffect(() => {
    registerTimer();
    return () => {
      clearTimer();
    };
  }, [clearTimer, registerTimer]);

  const maxReserve = useMemo(() => {
    const _maxReserve = maxReserveMap[key];
    const isReverse = (symbolOut || '') > (symbolIn || '');
    if (!_maxReserve) return undefined;
    return {
      reserveIn: isReverse ? _maxReserve.reserveOut : _maxReserve.reserveIn,
      reserveOut: isReverse ? _maxReserve.reserveIn : _maxReserve.reserveOut,
    };
  }, [key, maxReserveMap, symbolIn, symbolOut]);

  return {
    maxReserve,
    refresh,
    isError,
  };
};

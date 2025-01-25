import { useCallback, useEffect, useMemo, useRef } from 'react';
import { useAppEOASelector } from '../.';
import { useGetAwakenGasFee, useGetAwakenTokenPrice } from './request';
import { handleLoopFetch } from '@portkey-wallet/utils';
import { useCurrentNetwork } from '../network';
import { useAppCommonDispatch, useEffectOnce } from '../../index';
import {
  updateAwakenGasFee,
  updateAwakenTokenList,
  updateAwakenTokenPrices,
  updateAwakenUserExpiration,
  updateAwakenUserSlippageTolerance,
} from '@portkey-wallet/store/awaken/actions';
import { DEFAULT_EXPIRATION, DEFAULT_SLIPPAGE_TOLERANCE } from '@portkey-wallet/constants/awaken';
import { useDAppChain, useDAppChainId } from '../network/chain';
import { request } from '@portkey-wallet/api/api-eoa';
import { useCurrentAccount, useUniqueIdentify } from '../wallet';

export const useAwakenState = () => useAppEOASelector(state => state.awaken);

export const useAwakenGasFeeState = () => useAppEOASelector(state => state.awaken.gasFee);
export const useAwakenGasFee = () => {
  const currentNetwork = useCurrentNetwork();
  const awakenGasFeeState = useAwakenGasFeeState();

  return useMemo(() => awakenGasFeeState[currentNetwork] || '480000', [awakenGasFeeState, currentNetwork]);
};

export const useInitAwakenGasFeeState = () => {
  const dispatch = useAppCommonDispatch();
  const getAwakenGasFee = useGetAwakenGasFee();
  const network = useCurrentNetwork();
  const networkRef = useRef(network);
  networkRef.current = network;

  const init = useCallback(async () => {
    const _network = networkRef.current;
    try {
      const gasFee = await handleLoopFetch({
        fetch: getAwakenGasFee,
        times: 5,
        checkIsInvalid: () => _network !== networkRef.current,
      });
      if (!gasFee) return;
      dispatch(
        updateAwakenGasFee({
          network: _network,
          gasFee,
        }),
      );
    } catch (error) {
      console.log('useInitAwakenGasFeeState error', error);
    }
  }, [dispatch, getAwakenGasFee]);

  useEffectOnce(() => {
    init();
  });
};

export const useAwakenUserSlippageToleranceState = () => useAppEOASelector(state => state.awaken.userSlippageTolerance);

export const useAwakenUserSlippageTolerance = () => {
  const currentNetwork = useCurrentNetwork();
  const dispatch = useAppCommonDispatch();
  const awakenUserSlippageToleranceState = useAwakenUserSlippageToleranceState();

  const userSlippageTolerance = useMemo(
    () => awakenUserSlippageToleranceState[currentNetwork] || DEFAULT_SLIPPAGE_TOLERANCE,
    [awakenUserSlippageToleranceState, currentNetwork],
  );

  const update = useCallback(
    (val: string) => {
      dispatch(
        updateAwakenUserSlippageTolerance({
          network: currentNetwork,
          userSlippageTolerance: val,
        }),
      );
    },
    [currentNetwork, dispatch],
  );

  return {
    userSlippageTolerance,
    update,
  };
};

export const useAwakenUserExpirationState = () => useAppEOASelector(state => state.awaken.userExpiration);

export const useAwakenUserExpiration = () => {
  const currentNetwork = useCurrentNetwork();
  const dispatch = useAppCommonDispatch();
  const awakenUserExpirationState = useAwakenUserExpirationState();

  const userExpiration = useMemo(
    () => awakenUserExpirationState[currentNetwork] || DEFAULT_EXPIRATION,
    [awakenUserExpirationState, currentNetwork],
  );

  const update = useCallback(
    (val: string) => {
      dispatch(
        updateAwakenUserExpiration({
          network: currentNetwork,
          userExpiration: val,
        }),
      );
    },
    [currentNetwork, dispatch],
  );

  return {
    userExpiration,
    update,
  };
};

export const useAwakenTokenPricesState = () => useAppEOASelector(state => state.awaken.tokenPrices);

export type TUseAwakenTokenPricesParams = {
  symbol?: string;
  isInit?: boolean;
};
export const useAwakenTokenPrices = ({ symbol, isInit = true }: TUseAwakenTokenPricesParams) => {
  const currentNetwork = useCurrentNetwork();
  const dispatch = useAppCommonDispatch();
  const awakenTokenPricesState = useAwakenTokenPricesState();
  const dAppChain = useDAppChain();
  const key = useMemo(
    () => `${currentNetwork}_${dAppChain?.chainId}_${symbol}`,
    [dAppChain?.chainId, currentNetwork, symbol],
  );
  const getAwakenTokenPrice = useGetAwakenTokenPrice();

  const price = useMemo<string>(
    () => (awakenTokenPricesState[currentNetwork] || {})[key] || '0',
    [awakenTokenPricesState, currentNetwork, key],
  );

  const refresh = useCallback(async () => {
    if (!symbol || !dAppChain) return;
    const rst = await getAwakenTokenPrice({
      chainId: dAppChain.chainId,
      symbol,
      tokenAddress: dAppChain.defaultToken.address,
    });
    if (!rst) return;

    dispatch(
      updateAwakenTokenPrices({
        network: currentNetwork,
        val: {
          [key]: rst,
        },
      }),
    );
  }, [dAppChain, currentNetwork, dispatch, getAwakenTokenPrice, key, symbol]);

  useEffect(() => {
    isInit && refresh();
  }, [isInit, refresh]);

  return {
    price,
    refresh,
  };
};

export const useAwakenTokenListState = () => useAppEOASelector(state => state.awaken.tokenList);

export const useAwakenTokenList = (isInit = false) => {
  const awakenTokenListState = useAwakenTokenListState();
  const network = useCurrentNetwork();
  const chainId = useDAppChainId();
  const dispatch = useAppCommonDispatch();

  const list = useMemo(() => awakenTokenListState[network] || [], [awakenTokenListState, network]);
  const account = useCurrentAccount();
  const key = useUniqueIdentify();

  const refresh = useCallback(async () => {
    try {
      const rst = await request.assets.getAwakenTokenList({
        params: {
          skipCount: 0,
          maxResultCount: 1000,
          page: 1,
          chainId,
          caAddress: account?.address || '',
        },
      });
      dispatch(
        updateAwakenTokenList({
          key,
          list: rst.data,
        }),
      );
    } catch (error) {
      console.log('useAwakenTokenList refresh error', error);
    }
  }, [account?.address, chainId, dispatch, key]);

  useEffect(() => {
    if (!isInit) return;
    refresh();
  }, [isInit, refresh]);

  return { list, refresh };
};

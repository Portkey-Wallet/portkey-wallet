import { useCallback, useEffect, useMemo } from 'react';
import { useChainListMapState, useCurrentNetwork } from './index';
import { ChainId } from '@portkey-wallet/types';
import { request } from '@portkey-wallet/api/api-eoa';
import { NetworkList } from '@portkey-wallet/constants/constants-eoa/network';
import { useAppCommonDispatch } from '../../index';
import { setChainList } from '@portkey-wallet/store/store-eoa/network/actions';
import { handleLoopFetch } from '@portkey-wallet/utils';
import { MAIN_CHAIN_ID } from '@portkey-wallet/constants/network';

export const useChainList = () => {
  const chainListMapState = useChainListMapState();
  const currentNetwork = useCurrentNetwork();

  return useMemo(() => chainListMapState[currentNetwork], [chainListMapState, currentNetwork]);
};

export const useGetChainInfo = () => {
  const chainList = useChainList();

  return useCallback((chainId: ChainId) => chainList?.find(item => item.chainId === chainId), [chainList]);
};

export const useChainInfo = (chainId: ChainId) => {
  const getChainInfo = useGetChainInfo();
  return useMemo(() => getChainInfo(chainId), [chainId, getChainInfo]);
};

export const useInitChainList = () => {
  const currentNetwork = useCurrentNetwork();
  const dispatch = useAppCommonDispatch();

  const init = useCallback(async () => {
    try {
      const baseUrl = NetworkList.find(item => item.networkType === currentNetwork)?.apiUrl;

      const result = await handleLoopFetch({
        fetch: () => {
          return request.es.getChainsInfo({ baseURL: baseUrl });
        },
        times: 5,
        interval: 2000,
      });
      if (!result?.items) throw Error('No data');

      dispatch(
        setChainList({
          network: currentNetwork,
          chainList: result.items,
        }),
      );
    } catch (error: any) {
      console.log('useInitChainList error', error);
    }
  }, [currentNetwork, dispatch]);

  useEffect(() => {
    init();
  }, [init]);
};

export const useMainChain = () => {
  const chainList = useChainList();
  return useMemo(() => chainList?.find(item => item.chainId === MAIN_CHAIN_ID), [chainList]);
};

export const useDAppChain = () => {
  const chainList = useChainList();
  return useMemo(() => chainList?.find(item => item.chainId !== MAIN_CHAIN_ID), [chainList]);
};

export const useDAppChainId = () => {
  const dAppChain = useDAppChain();
  return useMemo(() => dAppChain?.chainId || 'tDVV', [dAppChain?.chainId]);
};

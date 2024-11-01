import { getChainListAsync } from '@portkey-wallet/store/store-ca/wallet/actions';
import { ChainItemType } from '@portkey-wallet/types/chain';
import { useEffect, useMemo } from 'react';
import { useAppCommonSelector, useAppCommonDispatch } from './index';

export function useNetwork() {
  return useAppCommonSelector(state => state.chain);
}

export function useNetworkList() {
  const { chainList } = useNetwork();
  return useMemo(() => {
    const commonList: ChainItemType[] = [];
    const customList: ChainItemType[] = [];
    const cmsList: ChainItemType[] = [];
    Array.isArray(chainList) &&
      chainList.forEach(chain => {
        if (chain.isCommon) commonList.push(chain);
        if (chain.isCustom) customList.push(chain);
        else cmsList.push(chain);
      });
    return { commonList, cmsList, customList };
  }, [chainList]);
}

export function useCurrentNetwork() {
  const { currentChain } = useNetwork();
  return useMemo(() => currentChain, [currentChain]);
}

export function useNetworkInitialization() {
  const dispatch = useAppCommonDispatch();
  useEffect(() => {
    try {
      dispatch(getChainListAsync());
    } catch (error) {
      console.log(error);
    }
  }, [dispatch]);
}

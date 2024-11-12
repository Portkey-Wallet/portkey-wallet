import { useAppCASelector } from '.';
import { useCallback, useState } from 'react';
import { useCurrentNetwork } from '@portkey-wallet/hooks/hooks-ca/network';
import { useAppCommonDispatch } from '../index';
import { ChainId } from '@portkey-wallet/types';
import { addRecentItem, resetTargetNetworkRecent } from '@portkey-wallet/store/store-ca/recent/slice';
import { IRecentItem } from '@portkey-wallet/store/store-ca/recent/type';
import { useTransferNetworkConfig } from './config';

export const useRecentState = () => useAppCASelector(state => state.recent);

export function useRecent() {
  const dispatch = useAppCommonDispatch();
  const currentNetwork = useCurrentNetwork();
  const { recentMap } = useRecentState();
  const { fetchAssetSupportConfig, checkIsSupportTargetChain } = useTransferNetworkConfig();

  const getRecentList = useCallback(
    (chainId: ChainId, tokenId: string) => {
      const id = `${chainId}-${tokenId}`;
      return recentMap?.[currentNetwork]?.[id] || [];
    },
    [currentNetwork, recentMap],
  );

  const getFilterRecentList = useCallback(
    (fromChainId: ChainId, tokenId: string) => {
      fetchAssetSupportConfig();
      const id = `${fromChainId}-${tokenId}`;
      const targetList = recentMap?.[currentNetwork]?.[id] || [];
      // aelf is OK, others need check
      const result = targetList.filter(ele => {
        if (ele.network === 'aelf') return true;

        return checkIsSupportTargetChain({ fromChainId, symbol: tokenId, network: ele.network });
      });
      return result || [];
    },
    [checkIsSupportTargetChain, currentNetwork, fetchAssetSupportConfig, recentMap],
  );

  const addRecent = useCallback(
    (params: {
      chainId: ChainId;
      tokenId: string; // ft is symbol, nft is nft
      recentItem: IRecentItem;
    }) => {
      return dispatch(addRecentItem({ ...params, network: currentNetwork }));
    },
    [currentNetwork, dispatch],
  );

  const resetRecent = useCallback(() => {
    return dispatch(resetTargetNetworkRecent({ network: currentNetwork }));
  }, [currentNetwork, dispatch]);

  return { getRecentList, getFilterRecentList, addRecent, resetRecent };
}

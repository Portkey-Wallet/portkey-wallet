import { useAppCASelector } from '.';
import { useCallback } from 'react';
import { useCurrentNetwork } from '@portkey-wallet/hooks/hooks-ca/network';
import { useAppCommonDispatch } from '../index';
import { ChainId } from '@portkey-wallet/types';
import { addRecentItem, resetTargetNetworkRecent } from '@portkey-wallet/store/store-ca/recent/slice';
import { IRecentItem } from '@portkey-wallet/store/store-ca/recent/type';

export const useRecentState = () => useAppCASelector(state => state.recent);

export function useRecent() {
  const dispatch = useAppCommonDispatch();
  const currentNetwork = useCurrentNetwork();
  const { recentMap } = useRecentState();

  const getRecentList = useCallback(
    (chainId: ChainId, tokenId: string) => {
      const id = `${chainId}-${tokenId}`;
      return recentMap?.[currentNetwork]?.[id] || [];
    },
    [currentNetwork, recentMap],
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

  return { getRecentList, addRecent, resetRecent };
}

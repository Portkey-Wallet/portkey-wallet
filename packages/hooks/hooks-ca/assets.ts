import { useCallback } from 'react';
import { useAppCASelector } from '.';
import { useCaAddressInfoList } from './wallet';
import { fetchNFTItem } from '@portkey-wallet/store/store-ca/assets/api';
import { ChainId } from '@portkey-wallet/types';

export const useAssets = () => useAppCASelector(state => state.assets);

export function useNFTItemDetail() {
  const caAddressInfos = useCaAddressInfoList();

  return useCallback(
    async ({ symbol, chainId }: { symbol: string; chainId: ChainId }) => {
      const caAddressInfo = caAddressInfos.filter(item => item.chainId === chainId);
      return fetchNFTItem({ caAddressInfos: caAddressInfo, symbol });
    },
    [caAddressInfos],
  );
}

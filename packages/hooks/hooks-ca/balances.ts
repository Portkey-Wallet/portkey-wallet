import { useCurrentNetworkInfo } from './network';
import { useMemo, useCallback } from 'react';
import { useAppCASelector } from './index';
import { useAssets } from './assets';
import { ChainId } from '@portkey-wallet/types';
import { useAppCommonDispatch } from '../';
import { fetchTargetTokenBalanceAsync } from '@portkey-wallet/store/store-ca/assets/slice';
import { useCaAddressInfoList } from './wallet';

export function useAllBalances() {
  return useAppCASelector(state => state.tokenBalance.balances);
}

export function useAccountCryptoBoxAssetList() {
  return useAppCASelector(state => state.assets?.accountCryptoBoxAssets.accountAssetsList);
}

export const useAccountBalanceUSD = () => {
  const { networkType = 'MAINNET' } = useCurrentNetworkInfo();
  const assetsState = useAssets();
  return useMemo(
    () => assetsState?.accountBalance?.accountBalanceInfo?.[networkType] || '',
    [assetsState?.accountBalance?.accountBalanceInfo, networkType],
  );
};

export function useBalance() {
  const { networkType: currentNetwork } = useCurrentNetworkInfo();
  const dispatch = useAppCommonDispatch();
  const caAddressInfoList = useCaAddressInfoList();

  const getAndUpdateTargetBalance = useCallback(
    async (chainId: ChainId, symbol: string) => {
      const currentCaAddress = caAddressInfoList?.find(ele => ele.chainId === chainId)?.caAddress || '';

      dispatch(fetchTargetTokenBalanceAsync({ chainId, symbol, currentNetwork, currentCaAddress }));
    },
    [caAddressInfoList, currentNetwork, dispatch],
  );

  return { getAndUpdateTargetBalance };
}

import { useCurrentNetwork } from '../network';
import { useMemo, useCallback } from 'react';
import { useAppCASelector } from '.';
import { useAssets } from './assets';
import { ChainId } from '@portkey-wallet/types';
import { useAppCommonDispatch } from '../';
import { fetchTargetTokenBalanceAsync } from '@portkey-wallet/store/store-ca/assets/slice';
import { useCaAddressInfoList } from './wallet';

export function useAllBalances() {
  return useAppCASelector(state => state.tokenBalance.balances);
}

export function useCurrentNetworkBalances() {
  const balances = useAllBalances();
  const currentNetwork = useCurrentNetwork();
  return useMemo(() => {
    if (!currentNetwork.rpcUrl) return;
    return balances?.[currentNetwork.rpcUrl];
  }, [balances, currentNetwork.rpcUrl]);
}

export function useAccountCryptoBoxAssetList() {
  return useAppCASelector(state => state.assets?.accountCryptoBoxAssets.accountAssetsList);
}

export const useAccountBalanceUSD = () => {
  const { networkType = 'MAINNET' } = useCurrentNetwork();
  const assetsState = useAssets();
  return useMemo(
    () => assetsState?.accountBalance?.accountBalanceInfo?.[networkType] || '',
    [assetsState?.accountBalance?.accountBalanceInfo, networkType],
  );
};

export function useBalance() {
  const { networkType: currentNetwork } = useCurrentNetwork();
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

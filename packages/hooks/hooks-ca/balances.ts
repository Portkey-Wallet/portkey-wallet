import { useCurrentNetwork } from '../network';
import { useMemo } from 'react';
import { useAppCASelector } from '.';
import { useAssets } from './assets';

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

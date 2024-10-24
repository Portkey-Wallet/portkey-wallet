import { useCurrentNetwork } from '../network';
import { useMemo } from 'react';
import { Account } from '@portkey-wallet/types/types-eoa/tokenBalance';
import { useAppEOASelector } from './index';

export function useAllBalances() {
  return useAppEOASelector(state => state.tokenBalance.balances);
}

export function useCurrentNetworkBalances() {
  const balances = useAllBalances();
  const currentNetwork = useCurrentNetwork();
  return useMemo(() => {
    if (!currentNetwork.rpcUrl) return;
    return balances?.[currentNetwork.rpcUrl];
  }, [balances, currentNetwork.rpcUrl]);
}

export function useAccountListNativeBalances() {
  const accountList = useAppEOASelector(state => state.wallet.accountList);
  const currentNetwork = useCurrentNetwork();
  const { nativeCurrency } = currentNetwork || {};
  const currentNetworkBalances = useCurrentNetworkBalances();
  return useMemo(() => {
    if (!currentNetworkBalances || !nativeCurrency) return;
    const obj: { [key: Account]: string } = {};
    accountList?.forEach(account => {
      const symbol = nativeCurrency.symbol;
      obj[account.address] = currentNetworkBalances?.[account.address]?.[symbol];
    });
    return obj;
  }, [nativeCurrency, currentNetworkBalances, accountList]);
}

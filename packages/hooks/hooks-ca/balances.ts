import { useCurrentNetwork } from '../network';
import { useMemo } from 'react';
import { useAppCASelector } from '.';
import { divDecimals, formatAmountShow } from '@portkey-wallet/utils/converter';
import { ZERO } from '@portkey-wallet/constants/misc';

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

export function useAccountTokenList() {
  return useAppCASelector(state => state.assets?.accountToken.accountTokenList);
}

export function useAllTokenInfoList() {
  return useAppCASelector(state => state.tokenManagement.tokenDataShowInMarket);
}

export const useAccountBalanceUSD = () => {
  const {
    accountToken: { accountTokenList },
    tokenPrices: { tokenPriceObject },
  } = useAppCASelector(state => state.assets);

  const accountBalanceUSD = useMemo(() => {
    const result = accountTokenList.reduce((acc, item) => {
      const { symbol, balance, decimals } = item;
      const price = tokenPriceObject[symbol];
      return acc.plus(divDecimals(balance, decimals).times(price));
    }, ZERO);

    return formatAmountShow(result, 2);
  }, [accountTokenList, tokenPriceObject]);

  return accountBalanceUSD;
};

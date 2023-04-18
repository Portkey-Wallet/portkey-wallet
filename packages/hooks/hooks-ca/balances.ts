import { useCurrentNetwork } from '../network';
import { useMemo, useCallback, useState } from 'react';
import { useAppCASelector } from '.';
import { useCurrentChain } from './chainList';
import { getElfChainStatus } from '@portkey-wallet/store/network/utils';
import useInterval from '../useInterval';
import { getELFTokenAddress } from '@portkey-wallet/contracts';
import { getELFContract } from '@portkey-wallet/utils/aelf';
import { useCurrentWalletInfo } from './wallet';
import { divDecimals, formatAmountShow, unitConverter } from '@portkey-wallet/utils/converter';
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

// FIXME: test balance hook
export function useCurrentELFBalances(dev?: boolean) {
  const chainInfo = useCurrentChain('AELF');
  const { AELF } = useCurrentWalletInfo();
  const [balance, setBalance] = useState<string>();
  const getBalances = useCallback(async () => {
    if (!chainInfo?.endPoint || !dev) return;
    try {
      const chainStatus = await getElfChainStatus(chainInfo.endPoint);
      const contractAddress = await getELFTokenAddress(chainInfo.endPoint, chainStatus.GenesisContractAddress);
      const contract = await getELFContract(chainInfo.endPoint, contractAddress);
      const balance = await contract.GetBalance.call({
        symbol: 'ELF',
        owner: AELF?.caAddress,
      });
      setBalance(
        `caHash: ${AELF?.caHash}\n\n caAddress: ${AELF?.caAddress}\n\nbalance: ${unitConverter(
          divDecimals(balance.balance, 8),
        )}`,
      );
    } catch (error) {
      console.debug(error, '====useCurrentELFBalances');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chainInfo]);
  const interval = useInterval(
    () => {
      if (!dev) interval.remove();
      getBalances();
    },
    60000,
    [getBalances],
  );
  return balance;
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

import { useCallback } from 'react';
import { useCurrentAccount } from '@portkey-wallet/hooks/hooks-eoa/wallet';

import { useGetTokenContract } from 'hooks/contract';

import { ChainId } from '@portkey-wallet/types';

export const useBalanceByContract = () => {
  const getTokenContract = useGetTokenContract();
  const currentAccount = useCurrentAccount();

  const getELFBalanceByContract = useCallback(
    async (chainId: ChainId) => {
      try {
        const tokenContract = await getTokenContract(chainId);
        const { data: balance } = await tokenContract.callViewMethod('GetBalance', {
          symbol: 'ELF',
          owner: currentAccount?.address || '',
        });

        return balance;
      } catch (error) {
        console.log('getBalance error', error);
      }
    },
    [currentAccount?.address, getTokenContract],
  );
  const getTokenBalanceByContract = useCallback(
    async (chainId: ChainId, symbol: string) => {
      try {
        const tokenContract = await getTokenContract(chainId);
        const { data: balance } = await tokenContract.callViewMethod('GetBalance', {
          symbol: symbol,
          owner: currentAccount?.address || '',
        });

        return balance;
      } catch (error) {
        console.log('getBalance error', error);
      }
    },
    [currentAccount?.address, getTokenContract],
  );

  return { getELFBalanceByContract, getTokenBalanceByContract };
};

import { useCallback } from 'react';
import { useSwapHookContractAddress } from '@portkey-wallet/hooks/hooks-ca/awaken';
import { useGetViewContract } from '../contract';
import { useDAppChainId } from '@portkey-wallet/hooks/hooks-ca/chainList';
export const useGetSwapHookViewContract = () => {
  const contractAddress = useSwapHookContractAddress();
  const getViewContract = useGetViewContract();
  const chainId = useDAppChainId();

  return useCallback(
    () =>
      getViewContract({
        chainId,
        contractAddress,
      }),
    [chainId, contractAddress, getViewContract],
  );
};

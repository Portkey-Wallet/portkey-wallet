import { useAwakenTokenList, useInitAwakenGasFeeState } from './state';
import { LIMIT_CONTRACT_ADDRESS, SWAP_HOOK_CONTRACT_ADDRESS_MAP } from '@portkey-wallet/constants/awaken';
import { useEffect, useMemo } from 'react';
import { useCurrentNetwork } from '../network';

export const useInitAwaken = () => {
  useInitAwakenGasFeeState();
  const { refresh } = useAwakenTokenList();

  useEffect(() => {
    refresh();
  }, [refresh]);
};

export const useSwapHookContractAddress = () => {
  const network = useCurrentNetwork();
  return useMemo(() => SWAP_HOOK_CONTRACT_ADDRESS_MAP[network], [network]);
};

export const useLimitContractAddress = () => {
  const network = useCurrentNetwork();
  return useMemo(() => LIMIT_CONTRACT_ADDRESS[network], [network]);
};

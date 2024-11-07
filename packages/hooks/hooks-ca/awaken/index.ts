import { useInitAwakenGasFeeState } from './state';
import { SWAP_HOOK_CONTRACT_ADDRESS_MAP } from '@portkey-wallet/constants/constants-ca/awaken';
import { useMemo } from 'react';
import { useCurrentNetwork } from '../network';

export const useInitAwaken = () => {
  useInitAwakenGasFeeState();
};

export const useSwapHookContractAddress = () => {
  const network = useCurrentNetwork();
  return useMemo(() => SWAP_HOOK_CONTRACT_ADDRESS_MAP[network], [network]);
};

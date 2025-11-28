import { useAwakenTokenList, useInitAwakenGasFeeState } from './state';
import { LIMIT_CONTRACT_ADDRESS, SWAP_HOOK_CONTRACT_ADDRESS_MAP } from '@portkey-wallet/constants/awaken';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useCurrentNetwork } from '../network';
import didServer from '@portkey-wallet/api/api-did/server';

export const useInitAwaken = () => {
  useInitAwakenGasFeeState();
  const { refresh } = useAwakenTokenList();

  const initWithAuth = useCallback(() => {
    refresh();
  }, [refresh]);

  const [isAuth, setIsAuth] = useState(false);
  useEffect(() => {
    didServer.onConnectTokenChange(() => {
      setIsAuth(true);
    });
  }, []);

  useEffect(() => {
    if (!isAuth) return;
    initWithAuth();
  }, [initWithAuth, isAuth]);
};

export const useSwapHookContractAddress = () => {
  const network = useCurrentNetwork();
  return useMemo(() => SWAP_HOOK_CONTRACT_ADDRESS_MAP[network], [network]);
};

export const useLimitContractAddress = () => {
  const network = useCurrentNetwork();
  return useMemo(() => LIMIT_CONTRACT_ADDRESS[network], [network]);
};

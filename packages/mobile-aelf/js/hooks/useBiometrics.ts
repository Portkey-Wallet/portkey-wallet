import { useCallback, useState } from 'react';
import { authenticationReady } from '@portkey-wallet/utils/mobile/authentication';
import useEffectOnce from './useEffectOnce';
import { useAppDispatch } from 'store/hooks';
import { setBiometrics } from 'store/user/actions';

export default function useBiometricsReady() {
  const [biometricsReady, setBiometricsReady] = useState<boolean>();
  const getAuthenticationReady = useCallback(async () => {
    setBiometricsReady(await authenticationReady());
  }, [setBiometricsReady]);
  useEffectOnce(() => {
    getAuthenticationReady();
  });
  return biometricsReady;
}

export function useSetBiometrics() {
  const dispatch = useAppDispatch();
  return useCallback(
    async (value: boolean) => {
      if (value) {
        const isReady = await authenticationReady();
        if (!isReady) throw new Error('biometrics is not ready');
      }
      dispatch(setBiometrics(value));
    },
    [dispatch],
  );
}

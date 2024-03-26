import { useCallback, useState } from 'react';
// import { authenticationReady } from '@portkey-wallet/utils/mobile/authentication';
import useEffectOnce from './useEffectOnce';
import { useRnSDKDispatch } from 'store';
import { setBiometrics } from 'store/user/actions';
import { authenticateBioReady } from 'service/biometric';

export default function useBiometricsReady() {
  const [biometricsReady, setBiometricsReady] = useState<boolean>();
  useEffectOnce(async () => {
    // const ready = await authenticationReady();
    const ready = await authenticateBioReady();
    setBiometricsReady(ready);
  });
  return biometricsReady;
}
export function useSetBiometrics() {
  const dispatch = useRnSDKDispatch();
  return useCallback(
    async (value: boolean) => {
      if (value) {
        const isReady = await authenticateBioReady();
        if (!isReady) throw new Error('biometrics is not ready');
      }
      dispatch(setBiometrics(value));
    },
    [dispatch],
  );
}

import { useState } from 'react';
import { authenticationReady } from '@portkey-wallet/utils/mobile/authentication';
import useEffectOnce from './useEffectOnce';

export default function useBiometricsReady() {
  const [biometricsReady, setBiometricsReady] = useState<boolean>();
  useEffectOnce(async () => {
    const ready = await authenticationReady();
    setBiometricsReady(ready);
  });
  return biometricsReady;
}

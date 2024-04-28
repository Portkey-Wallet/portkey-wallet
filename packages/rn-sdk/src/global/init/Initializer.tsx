import { useEffectOnce } from '@portkey-wallet/hooks';
import { useCurrentNetworkInfo } from '@portkey-wallet/hooks/hooks-ca/network';
import { request } from '@portkey-wallet/api/api-did';
import { useRefreshTokenConfig } from '@portkey-wallet/hooks/hooks-ca/api';
import { useCaInfoOnChain } from '@portkey-wallet/rn-base/hooks/useCaInfoOnChain';
// import { usePin } from 'store/hook';
import { usePin } from '@portkey-wallet/rn-base/hooks/store';
import { useMemo } from 'react';

export default function Initializer() {
  const { apiUrl } = useCurrentNetworkInfo();
  const refreshTokenConfig = useRefreshTokenConfig();
  const pin = usePin();
  useCaInfoOnChain();
  useEffectOnce(() => {
    request.set('baseURL', apiUrl);
  });
  useMemo(async () => {
    await refreshTokenConfig(pin);
  }, [pin, refreshTokenConfig]);
  return null;
}

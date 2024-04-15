import { useEffectOnce } from '@portkey-wallet/hooks';
import { useCurrentNetworkInfo } from '@portkey-wallet/hooks/hooks-ca/network';
import { request } from '@portkey-wallet/rn-inject-sdk';
import { request as appRequest } from '@portkey-wallet/api/api-did';
import { useRefreshTokenConfig } from '@portkey-wallet/hooks/hooks-ca/api';
// import { usePin } from 'store/hook';
import { usePin } from '@portkey-wallet/rn-base/hooks/store';
import { useMemo } from 'react';
export default function Initializer() {
  const { apiUrl } = useCurrentNetworkInfo();
  const refreshTokenConfig = useRefreshTokenConfig();
  const pin = usePin();
  useEffectOnce(() => {
    request.set('baseURL', apiUrl);
    appRequest.set('baseURL', apiUrl);
  });
  useMemo(async () => {
    await refreshTokenConfig(pin);
  }, [pin, refreshTokenConfig]);
  return null;
}

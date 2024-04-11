import { useEffectOnce } from '@portkey-wallet/hooks';
import { useCurrentNetworkInfo } from '@portkey-wallet/hooks/hooks-ca/network';
import { request } from '@portkey-wallet/rn-inject-sdk';

export default function Initializer() {
  const { apiUrl } = useCurrentNetworkInfo();
  useEffectOnce(() => {
    request.set('baseURL', apiUrl);
  });
  return null;
}

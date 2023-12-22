import { ISocialLogin } from '@portkey-wallet/types/types-ca/wallet';
import { Button } from 'antd';
import { useCallback } from 'react';
import { useWalletInfo } from 'store/Provider/hooks';
import { socialLoginAction } from 'utils/lib/serviceWorkerAction';

export default function Login() {
  const { currentNetwork } = useWalletInfo();
  const login = useCallback(
    async (v: ISocialLogin) => {
      const result = await socialLoginAction(v, currentNetwork);
      console.log(result, 'Login====');
    },
    [currentNetwork],
  );

  return (
    <div>
      <Button onClick={() => login('Google')}>Google</Button>
      <Button onClick={() => login('Apple')}>APPLE</Button>
    </div>
  );
}

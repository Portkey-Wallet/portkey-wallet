import { ISocialLogin } from '@portkey-wallet/types/types-ca/wallet';
import { Button } from 'antd';
import { zkloginGuardianType } from 'constants/guardians';
import { useCallback } from 'react';
import { useWalletInfo } from 'store/Provider/hooks';
import { VerifyTypeEnum } from 'types/wallet';
import { socialLoginAction } from 'utils/lib/serviceWorkerAction';

export default function Login() {
  const { currentNetwork } = useWalletInfo();
  const login = useCallback(
    async (v: ISocialLogin) => {
      const _verifyType = zkloginGuardianType.includes(v) ? VerifyTypeEnum.zklogin : undefined;
      const result = await socialLoginAction(v, currentNetwork, _verifyType);
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

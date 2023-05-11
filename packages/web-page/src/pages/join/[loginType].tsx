import React from 'react';
import SocialTem from './components/SocialTem';
import { useRouter } from 'next/router';
import { ISocialLogin } from '@portkey-wallet/types/types-ca/wallet';

export default function ExtensionLogin() {
  const router = useRouter();
  const { loginType } = router.query;

  return (
    <>
      <SocialTem loginType={loginType as ISocialLogin} />
    </>
  );
}

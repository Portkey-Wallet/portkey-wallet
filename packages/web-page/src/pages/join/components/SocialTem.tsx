import { useCallback } from 'react';
import dynamic from 'next/dynamic';
import { Button } from 'antd';
import type { IResolveParams } from 'reactjs-social-login';
import styles from './styles.module.less';
import { PortkeyLogo, Google, Apple } from 'assets/images';
import { ISocialLogin } from '@portkey-wallet/types/types-ca/wallet';

const LoginSocialGoogle = dynamic<any>(
  import('reactjs-social-login').then(module => module.LoginSocialGoogle),
  { ssr: false },
);
const LoginSocialApple = dynamic(import('components/LoginSocialApple'), { ssr: false });

const SUPPORT_TYPE = ['Google', 'Apple'];

export default function SocialTem({ loginType }: { loginType: ISocialLogin }) {
  const onSuccess = useCallback(async (response: IResolveParams) => {
    console.log(response, 'response====');
    window.portkey?.request({
      method: 'portkey_socialLogin',
      params: {
        response: { ...response.data, provider: response.provider },
      },
    });
  }, []);

  const onError = useCallback((error: any) => {
    console.log(error, 'onError===LoginSocial');
    window.portkey?.request({
      method: 'portkey_socialLogin',
      params: { error: typeof error === 'string' ? error : error?.err || error },
    });
  }, []);

  return (
    <div className={styles['social-login-wrapper']}>
      <div className={styles['social-login-inner']}>
        <div className={styles['social-login-logo']}>
          <img className={styles['portkey-logo']} src={PortkeyLogo.src} />
        </div>

        {SUPPORT_TYPE.includes(loginType) ? (
          <>
            <p className={styles['description']}>{`Click below to join Portkey using your ${loginType} account`}</p>

            {loginType === 'Google' && (
              <LoginSocialGoogle
                isOnlyGetToken
                scope={
                  'https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile'
                }
                client_id={process.env.NEXT_PUBLIC_GG_APP_ID || ''}
                onResolve={onSuccess}
                onReject={onError}>
                <Button className={styles['common-btn']}>
                  {/* <Image alt="Google Logo" className={styles['btn-logo']} src={Google.src} /> */}
                  <img className={styles['btn-logo']} src={Google.src} />
                  Join with Google
                </Button>
              </LoginSocialGoogle>
            )}

            {loginType === 'Apple' && (
              <LoginSocialApple
                client_id={process.env.NEXT_PUBLIC_APP_APPLE_ID || ''}
                scope={'name email'}
                redirect_uri={process.env.NEXT_PUBLIC_APP_APPLE_REDIRECT_URI || ''}
                onReject={onError}>
                <Button className={styles['common-btn']}>
                  <img className={styles['btn-logo']} src={Apple.src} />
                  Join with Apple
                </Button>
              </LoginSocialApple>
            )}
          </>
        ) : (
          <div className={styles['no-content']}>NO CONTENT</div>
        )}
      </div>
    </div>
  );
}

import { useCurrentNetworkInfo } from '@portkey-wallet/hooks/hooks-ca/network';
import { ConfigProvider, ReCaptchaResponseType } from '@portkey/did-ui-react';
import { localStorage } from 'redux-persist-webextension-storage';
import { useCallback, useMemo } from 'react';
import { useLoading } from 'store/Provider/hooks';
import { reCAPTCHAAction, socialLoginAction } from 'utils/lib/serviceWorkerAction';
import { ISocialLogin } from '@portkey-wallet/types/types-ca/wallet';
import { sleep } from '@portkey-wallet/utils';
import { zkloginGuardianType } from 'constants/guardians';
import { VerifyTypeEnum } from 'types/wallet';

const usePortkeyUIConfig = () => {
  const currentNetwork = useCurrentNetworkInfo();
  const { setLoading } = useLoading();
  const customReCaptchaHandler: () => Promise<{
    type: ReCaptchaResponseType;
    message?: any;
  }> = useCallback(async () => {
    const reCaptcha = await reCAPTCHAAction();
    if (reCaptcha.error) return { type: 'error', message: reCaptcha.message };
    return { type: 'success', message: reCaptcha.response };
  }, []);

  const socialLoginHandler = useCallback(
    async (v: ISocialLogin) => {
      await sleep(10);
      setLoading(true);
      const _verifyType = zkloginGuardianType.includes(v) ? VerifyTypeEnum.zklogin : undefined;
      const result: any = await socialLoginAction(v, currentNetwork.networkType, _verifyType);

      if (result.error) {
        setLoading(false);
        return { error: Error(result.message) };
      }
      return {
        data: { ...result.data, accessToken: result.data.access_token },
        error: result.error,
      };
    },

    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentNetwork.networkType],
  );
  useMemo(() => {
    ConfigProvider.setGlobalConfig({
      storageMethod: localStorage,
      graphQLUrl: currentNetwork.graphqlUrl,
      socketUrl: `${currentNetwork.apiUrl}/ca`,
      socialLogin: {
        Google: {
          clientId: '',
          customLoginHandler: () => socialLoginHandler('Google'),
        },
        Apple: {
          clientId: '',
          customLoginHandler: () => socialLoginHandler('Apple'),
        },
        Telegram: {
          customLoginHandler: () => socialLoginHandler('Telegram'),
        },
        Twitter: {
          customLoginHandler: () => socialLoginHandler('Twitter'),
        },
        Facebook: {
          customLoginHandler: () => socialLoginHandler('Facebook'),
        },
      },
      requestDefaults: {
        baseURL: currentNetwork.apiUrl,
      },
      reCaptchaConfig: {
        customReCaptchaHandler,
      },
    });
  }, [currentNetwork, customReCaptchaHandler, socialLoginHandler]);
};

export default usePortkeyUIConfig;

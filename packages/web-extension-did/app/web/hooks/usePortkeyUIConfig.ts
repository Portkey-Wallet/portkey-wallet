import { useCurrentNetworkInfo, useNetworkList } from '@portkey-wallet/hooks/hooks-ca/network';
import { ConfigProvider, ReCaptchaType, setLoading } from '@portkey/did-ui-react';
import { localStorage } from 'redux-persist-webextension-storage';
import { useMemo, useCallback } from 'react';
import { reCAPTCHAAction, socialLoginAction } from 'utils/lib/serviceWorkerAction';
import { ISocialLogin } from '@portkey-wallet/types/types-ca/wallet';

const usePortkeyUIConfig = () => {
  const currentNetwork = useCurrentNetworkInfo();
  const networkList = useNetworkList();

  const customReCaptchaHandler: () => Promise<{
    type: ReCaptchaType;
    message?: any;
  }> = useCallback(async () => {
    const reCaptcha = await reCAPTCHAAction();
    if (reCaptcha.error) return { type: 'error', message: reCaptcha.message };
    return { type: 'success', message: reCaptcha.response };
  }, []);

  const socialLoginHandler = useCallback(
    async (v: ISocialLogin) => {
      setLoading(true);
      const result: any = await socialLoginAction(v, currentNetwork.networkType);

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
      socialLogin: {
        Google: {
          clientId: '',
          customLoginHandler: () => socialLoginHandler('Google'),
        },
        Apple: {
          clientId: '',
          customLoginHandler: () => socialLoginHandler('Apple'),
        },
      },
      requestDefaults: {
        baseURL: currentNetwork.apiUrl,
      },
      network: {
        defaultNetwork: currentNetwork.networkType,
        networkList: networkList,
      },
      reCaptchaConfig: {
        customReCaptchaHandler,
      },
    });
  }, [currentNetwork, customReCaptchaHandler, networkList, socialLoginHandler]);
};

export default usePortkeyUIConfig;

import { firebase } from '@react-native-firebase/app-check';
import { copyText } from 'utils';

export const getAppCheckToken = async (forceRefresh?: boolean): Promise<string> => {
  try {
    const { token } = await firebase.appCheck().getToken(forceRefresh);
    if (token?.length > 0 && __DEV__) await copyText(token);
    alert(token);
    console.log('app check token!', token);

    return token || '';
  } catch (error) {
    console.log('get appCheck token failed', error);
    return '';
  }
};

export async function setupAppCheck() {
  const appCheckProvider = firebase.appCheck().newReactNativeFirebaseAppCheckProvider();
  appCheckProvider.configure({
    android: {
      provider: __DEV__ ? 'debug' : 'playIntegrity',
      debugToken: '21214D7B-5841-48EE-931D-90E6A02B2EB3',
    },
    apple: {
      provider: __DEV__ ? 'debug' : 'appAttestWithDeviceCheckFallback',
      debugToken: 'D04D5C23-41F1-450E-BD02-C70B1E6D9F95',
    },
    web: {
      provider: 'reCaptchaV3',
      siteKey: 'unknown',
    },
  });
  firebase.appCheck().initializeAppCheck({ provider: appCheckProvider, isTokenAutoRefreshEnabled: true });
}

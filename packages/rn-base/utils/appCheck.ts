import { DEFAULT_FETCH_TIMEOUT } from '@portkey-wallet/constants/misc';
import { firebase } from '@react-native-firebase/app-check';
import Config from 'react-native-config';
import { copyText } from '.';

export const getAppCheckToken = async (forceRefresh?: boolean): Promise<string> => {
  let timer: string | number | NodeJS.Timeout | undefined;
  const timeoutPromise = new Promise<string>((_, reject) => {
    timer = setTimeout(() => {
      reject(new Error('getAppCheckToken timeout'));
    }, DEFAULT_FETCH_TIMEOUT);
  });

  const appCheckTokenPromise = new Promise<string>((resolve, reject) => {
    firebase
      .appCheck()
      .getToken(forceRefresh)
      .then(({ token }) => {
        if (token?.length > 0 && __DEV__) copyText(token);
        console.log('app check token!', token);
        resolve(token || '');
      })
      .catch(error => {
        reject(error);
      });
  });

  return Promise.race([timeoutPromise, appCheckTokenPromise]).finally(() => {
    clearTimeout(timer);
  });
};

export async function setupAppCheck() {
  const appCheckProvider = firebase.appCheck().newReactNativeFirebaseAppCheckProvider();
  await appCheckProvider.configure({
    android: {
      provider: __DEV__ ? 'debug' : 'playIntegrity',
      debugToken: Config.ANDROID_APP_CHECK_DEBUG_KEY || '',
    },
    apple: {
      // TODO: change provider type
      provider: 'debug',
      debugToken: Config.IOS_APP_CHECK_DEBUG_KEY || '',
    },
    web: {
      provider: 'reCaptchaV3',
      siteKey: 'unknown',
    },
  });
  await firebase.appCheck().initializeAppCheck({ provider: appCheckProvider, isTokenAutoRefreshEnabled: true });
}

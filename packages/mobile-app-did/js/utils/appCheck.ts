import { firebase } from '@react-native-firebase/app-check';
import { copyText } from 'utils';

export const getAppCheckToken = async (forceRefresh?: boolean): Promise<string> => {
  return new Promise<string>((resolve, reject) => {
    const timeout = setTimeout(() => {
      reject(new Error('getAppCheckToken timeout'));
    }, 8000);
    firebase
      .appCheck()
      .getToken(forceRefresh)
      .then(({ token }) => {
        if (token?.length > 0 && __DEV__) copyText(token);
        console.log('app check token!', token);
        resolve(token || '');
      })
      .catch(error => reject(error))
      .finally(() => clearTimeout(timeout));
  });
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

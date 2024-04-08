import * as WebBrowser from 'expo-web-browser';
import { isIOS } from '@portkey-wallet/utils/mobile/device';
import { checkIsUserCancel, handleErrorMessage, sleep } from '@portkey-wallet/utils';
import { AppState, EmitterSubscription, Linking, NativeEventSubscription } from 'react-native';
import { LINK_TWITTER_URL, SCHEME } from '../constants/authentication';
import { USER_CANCELED } from '@portkey-wallet/constants/errorMessage';
import { request } from '@portkey-wallet/api/api-did';
import { parse } from 'query-string';
import { LoginManager, AccessToken } from 'react-native-fbsdk-next';
import { parseAppleIdentityToken, parseFacebookToken } from '@portkey-wallet/utils/authentication';
import appleAuth, { appleAuthAndroid } from '@invertase/react-native-apple-authentication';
import { TAppleAuthentication, TFacebookAuthentication, TTwitterAuthentication } from '../types/authentication';

const OPEN_FAIL = 'No matching browser activity found';

export function openAuthSessionAsyncByLinking(webUrl: string, redirectUrl?: string | null) {
  return new Promise<WebBrowser.WebBrowserAuthSessionResult>((resolve, reject) => {
    Linking.openURL(webUrl)
      .then(() => {
        let linkingListener: EmitterSubscription | null = null;
        let appStateListener: NativeEventSubscription | null = null;
        const remove = () => {
          linkingListener?.remove();
          appStateListener?.remove();
        };
        linkingListener = Linking.addEventListener('url', ({ url }) => {
          if (url.includes('code')) {
            remove();
            resolve({ type: 'success', url } as WebBrowser.WebBrowserAuthSessionResult);
          }
        });
        appStateListener = AppState.addEventListener('focus', async () => {
          sleep(1000);
          remove();
          resolve({ type: 'cancel' } as WebBrowser.WebBrowserAuthSessionResult);
        });
      })
      .catch(reject);
  });
}

export function onTwitterLogin(isLinkingLogin?: boolean) {
  const login = async (
    resolve: (
      value: WebBrowser.WebBrowserAuthSessionResult | PromiseLike<WebBrowser.WebBrowserAuthSessionResult>,
    ) => void,
    reject: (reason?: any) => void,
  ) => {
    let linkingListener: EmitterSubscription | undefined;
    try {
      if (!isIOS && !isLinkingLogin) {
        linkingListener = Linking.addEventListener('url', ({ url }) => {
          if (url.includes('code')) {
            linkingListener?.remove();
            resolve({ type: 'success', url } as WebBrowser.WebBrowserAuthSessionResult);
          }
        });
      }
      const info = await (isLinkingLogin ? openAuthSessionAsyncByLinking : WebBrowser.openAuthSessionAsync)(
        LINK_TWITTER_URL,
      );
      if (info.type === 'success') {
        linkingListener?.remove();
        resolve(info);
      } else {
        await sleep(1000);
        linkingListener?.remove();
        resolve(info);
      }
    } catch (webBrowserError) {
      const message = handleErrorMessage(webBrowserError);
      if (message.includes(OPEN_FAIL)) {
        try {
          resolve(await onTwitterLogin(true));
        } catch (error) {
          reject(error);
        }
      }
      reject(webBrowserError);
    } finally {
      linkingListener?.remove();
    }
  };

  return new Promise<WebBrowser.WebBrowserAuthSessionResult>((resolve, reject) => login(resolve, reject));
}

export async function onTwitterAuthentication() {
  try {
    const info = await onTwitterLogin();
    if (info.type === 'success') {
      if (info.url.includes('access_denied')) {
        throw new Error(USER_CANCELED);
      } else {
        const userInfo = await request.wallet.getTwitterUserInfo({
          params: {
            redirectUrl: SCHEME,
            state: 'state',
            code: parse(info.url).code,
          },
          stringifyOptions: { encode: false },
        });
        return {
          ...userInfo,
          user: userInfo.userInfo,
          accessToken: JSON.stringify({ ...userInfo.userInfo, token: userInfo.accessToken }),
        } as TTwitterAuthentication;
      }
    } else if (info.type === 'cancel') {
      throw new Error(USER_CANCELED);
    } else {
      throw new Error(USER_CANCELED);
    }
  } catch (error) {
    if (checkIsUserCancel(error)) throw new Error('');
    throw error;
  }
}

export function onAndroidFacebookAuthentication() {
  return new Promise<TFacebookAuthentication>((resolve, reject) => {
    LoginManager.logInWithPermissions(['public_profile']).then(function (result) {
      if (result.isCancelled) {
        reject(Error(USER_CANCELED));
      } else {
        AccessToken.getCurrentAccessToken()
          .then(async data => {
            if (data) {
              const expiredTime = Math.ceil(data.expirationTime / 1000);
              const token = data.accessToken;
              const userId = data.userID;
              data.accessToken = JSON.stringify({ expiredTime, token, userId });
              const fbInfo = await parseFacebookToken(data.accessToken);

              const info = { accessToken: data?.accessToken, user: fbInfo } as TFacebookAuthentication;
              resolve(info);
            } else {
              reject(Error(USER_CANCELED));
            }
          })
          .catch(reject);
      }
    }, reject);
  });
}

export async function oniOSAppleAuthentication() {
  const appleInfo = await appleAuth.performRequest({
    requestedOperation: appleAuth.Operation.LOGIN,
    requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
  });

  const user = parseAppleIdentityToken(appleInfo.identityToken);
  if (appleInfo.fullName?.familyName) {
    try {
      await request.verify.sendAppleUserExtraInfo({
        params: {
          identityToken: appleInfo.identityToken,
          userInfo: {
            name: {
              firstName: appleInfo.fullName?.givenName,
              lastName: appleInfo.fullName?.familyName,
            },
            email: user?.email || appleInfo.email,
          },
        },
      });
    } catch (error) {
      console.log(error, '======error');
    }
  }
  const userInfo = { ...appleInfo, user: { ...user, id: user?.userId } } as TAppleAuthentication;
  return userInfo;
}

export async function onAndroidAppleAuthentication() {
  const appleInfo = await appleAuthAndroid.signIn();
  const user = parseAppleIdentityToken(appleInfo.id_token);
  if (appleInfo.user?.name?.lastName) {
    try {
      await request.verify.sendAppleUserExtraInfo({
        params: {
          identityToken: appleInfo.id_token,
          userInfo: {
            name: {
              firstName: appleInfo.user.name.firstName,
              lastName: appleInfo.user.name.lastName,
            },
            email: user?.email || appleInfo.user.email,
          },
        },
      });
    } catch (error) {
      console.log(error, '======error');
    }
  }
  const userInfo = {
    identityToken: appleInfo.id_token,
    fullName: {
      givenName: appleInfo.user?.name?.firstName,
      familyName: appleInfo.user?.name?.lastName,
    },
    user: { ...user, id: user?.userId },
  } as TAppleAuthentication;
  return userInfo;
}

export async function onAppleAuthentication() {
  try {
    return (isIOS ? oniOSAppleAuthentication : onAndroidAppleAuthentication)();
  } catch (error: any) {
    const message = error?.message === appleAuthAndroid.Error.SIGNIN_CANCELLED ? '' : handleErrorMessage(error);
    // : 'It seems that the authorization with your Apple ID has failed.';
    throw { ...error, message };
  }
}

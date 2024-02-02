import * as WebBrowser from 'expo-web-browser';
import { isIOS } from '@portkey-wallet/utils/mobile/device';
import { handleErrorMessage, sleep } from '@portkey-wallet/utils';
import { AppState, EmitterSubscription, Linking, NativeEventSubscription } from 'react-native';
import { LINK_TWITTER_URL } from 'constants/authentication';

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

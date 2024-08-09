import React, { useCallback, useRef, useState } from 'react';
import OverlayModal from 'components/OverlayModal';
import { Keyboard, View } from 'react-native';
import { ModalBody } from 'components/ModalBody';
import WebView from 'react-native-webview';
import Lottie from 'lottie-react-native';
import { pTd } from 'utils/unit';
import { StyleSheet } from 'react-native';
import GStyles from 'assets/theme/GStyles';
import { BGStyles } from 'assets/theme/styles';
import { USER_CANCELED } from '@portkey-wallet/constants/errorMessage';

import { WebViewNavigationEvent } from 'react-native-webview/lib/WebViewTypes';
import { WebViewMessageEvent } from 'react-native-webview';
import { InjectFacebookOpenJavaScript, FBAuthPush, FB_FUN, PATHS } from './config';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { handleErrorMessage } from '@portkey-wallet/utils';
import { parseFacebookJWTToken } from '@portkey-wallet/utils/authentication';
import { useCurrentNetworkInfo } from '@portkey-wallet/hooks/hooks-ca/network';
import { TGoogleAuthentication } from 'types/authentication';
import generateRandomNonce from '@portkey-wallet/utils/nonce';

type GoogleProps = {
  onConfirm: (userInfo: TGoogleAuthentication) => void;
  onReject: (reason: any) => void;
};

function GoogleSign({ onConfirm, onReject }: GoogleProps) {
  const [loading, setLoading] = useState(true);
  const ref = useRef<WebView>();
  const { domain, apiUrl, portkeyOpenLoginUrl } = useCurrentNetworkInfo();
  const [nonce] = useState(generateRandomNonce());

  const onLoadStart = useCallback(({ nativeEvent }: WebViewNavigationEvent) => {
    if (nativeEvent.url.includes(FBAuthPush)) {
      setLoading(false);
    }
  }, []);
  const onMessage = useCallback(
    async ({ nativeEvent }: WebViewMessageEvent) => {
      const { data } = nativeEvent;
      try {
        const obj = JSON.parse(data);
        const { type, payload } = obj;
        if (payload.error) {
          onReject(USER_CANCELED);
        } else {
          const idToken = payload.response.id_token;
          const accessToken = payload.response.access_token;
          if (type === FB_FUN.Login_Success && idToken && accessToken) {
            // const fbInfo = parseFacebookJWTToken(idToken, accessToken);
            // if (!fbInfo) throw new Error('Failed to parse Facebook token');
            // console.log('aaaa fb payload : ', JSON.stringify(payload));
            // onConfirm({ accessToken: payload.response.access_token, user: fbInfo, nonce });
            OverlayModal.hide();
          } else {
            onReject(USER_CANCELED);
          }
        }
      } catch (error) {
        onReject(handleErrorMessage(error));
      }
    },
    [nonce, onConfirm, onReject],
  );
  return (
    <ModalBody title="Google Login" modalBodyType="bottom">
      <KeyboardAwareScrollView enableOnAndroid={true} contentContainerStyle={styles.container}>
        {loading && (
          <View style={styles.loadingBox}>
            <Lottie
              source={require('assets/lottieFiles/globalLoading.json')}
              style={styles.loadingStyle}
              autoPlay
              loop
            />
          </View>
        )}
        <WebView
          ref={ref as any}
          source={{
            uri: `${portkeyOpenLoginUrl}${PATHS.LoadGoogle}?socialType=zklogin&nonce=${nonce}&redirectURI=${
              domain || apiUrl
            }${FBAuthPush}`,
          }}
          originWhitelist={['*']}
          injectedJavaScript={InjectFacebookOpenJavaScript}
          javaScriptCanOpenWindowsAutomatically={true}
          onMessage={onMessage}
          onLoadEnd={() => {
            ref.current?.injectJavaScript(InjectFacebookOpenJavaScript);
          }}
          onLoadStart={onLoadStart}
        />
      </KeyboardAwareScrollView>
    </ModalBody>
  );
}

const sign = () => {
  Keyboard.dismiss();
  return new Promise<TGoogleAuthentication>((resolve, reject) => {
    OverlayModal.show(<GoogleSign onConfirm={resolve} onReject={reject} />, {
      position: 'bottom',
      onDisappearCompleted: () => reject(new Error(USER_CANCELED)),
    });
  });
};

export default {
  sign,
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  loadingStyle: {
    width: pTd(50),
  },
  loadingBox: {
    ...GStyles.center,
    ...BGStyles.bg1,
    zIndex: 999,
    position: 'absolute',
    bottom: 0,
    top: 0,
    left: 0,
    right: 0,
  },
});

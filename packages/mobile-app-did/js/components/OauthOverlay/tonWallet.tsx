import React, { useCallback, useRef, useState } from 'react';
import OverlayModal from 'components/OverlayModal';
import { Keyboard, Linking, View } from 'react-native';
import { ModalBody } from 'components/ModalBody';
import WebView from 'react-native-webview';
import Lottie from 'lottie-react-native';
import { pTd } from 'utils/unit';
import { StyleSheet } from 'react-native';
import GStyles from 'assets/theme/GStyles';
import { BGStyles } from 'assets/theme/styles';
import { USER_CANCELED } from '@portkey-wallet/constants/errorMessage';
import { parseUrl } from 'query-string';
import { parseTelegramToken } from '@portkey-wallet/utils/authentication';
import { OpenLogin } from '@portkey-wallet/constants/constants-ca/network';
import { useCurrentNetworkInfo } from '@portkey-wallet/hooks/hooks-ca/network';

import { WebViewNavigationEvent } from 'react-native-webview/lib/WebViewTypes';
import { WebViewMessageEvent } from 'react-native-webview';
import {
  InjectTelegramLoginJavaScript,
  InjectTonOpenJavaScript,
  PATHS,
  TGAuthCallBack,
  TGAuthPush,
  TGAuthResult,
  TG_FUN,
  TON_FUN,
  parseTGAuthResult,
} from './config';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

type TelegramSignProps = {
  onConfirm: (userInfo: any) => void;
  onReject: (reason: any) => void;
};

function TonSign({ onConfirm, onReject }: TelegramSignProps) {
  const [loading, setLoading] = useState(false);
  const { networkType, apiUrl } = useCurrentNetworkInfo();
  const [uri, go] = useState(
    `http://192.168.1.29:3000/social-login/Ton?from=portkey&manifestUrl=https://raw.githubusercontent.com/alex-beango/ton-config/main/tonconnect-manifest.json`,
  );
  // const [uri, go] = useState(`https://ton-config-david.vercel.app`);
  const ref = useRef<WebView>();
  const onLoadStart = useCallback(
    ({ nativeEvent }: WebViewNavigationEvent) => {
      try {
        if (nativeEvent.url.includes(TGAuthPush)) {
          setLoading(true);
        } else if (nativeEvent.url.includes(TGAuthResult)) {
          setLoading(true);
          go(`${apiUrl}${PATHS.CallPortkey}?${parseTGAuthResult(nativeEvent.url)}`);
        } else if (nativeEvent.url.includes(TGAuthCallBack)) {
          try {
            if (nativeEvent.url.includes(TGAuthCallBack)) {
              const parseData = parseUrl(nativeEvent.url);
              const { token } = parseData.query || {};
              if (typeof token === 'string') {
                const user = parseTelegramToken(token);
                if (!user) return onReject(new Error('Invalid Token'));
                const userInfo: any = {
                  user,
                  accessToken: token,
                };
                onConfirm(userInfo);
              }
            }
          } catch (error) {
            onReject(error);
          } finally {
            OverlayModal.hide(false);
          }
        }
      } catch (error) {
        onReject(error);
        OverlayModal.hide(false);
      }
    },
    [apiUrl, onConfirm, onReject],
  );

  const onMessage = useCallback(
    ({ nativeEvent }: WebViewMessageEvent) => {
      const { data } = nativeEvent;

      console.log('onMessage', JSON.parse(data));

      try {
        const obj = JSON.parse(data);
        const { type } = obj;
        if (type === TG_FUN.Error) {
          onReject(USER_CANCELED);
          OverlayModal.hide();
        } else if (type === TON_FUN.Open) {
          // go(obj.url);
          console.log('openURL', obj);
          const tmpUrl = obj.url.replace(/&ret=.*/g, '&ret=portkey.finance://portkey');
          Linking.openURL(tmpUrl);
        } else if (type === TON_FUN.AuthorizeSuccess) {
          OverlayModal.hide();
          console.log('WalletInfoChange', obj);
          alert('WalletInfoChange' + JSON.stringify(obj));
          onConfirm(obj);
        }
      } catch (error) {
        console.log(error);
      }
    },
    [onConfirm, onReject],
  );
  return (
    <ModalBody title="TonWallet Login" modalBodyType="bottom">
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
          source={{ uri }}
          originWhitelist={['*']}
          injectedJavaScript={InjectTonOpenJavaScript}
          javaScriptCanOpenWindowsAutomatically={true}
          onLoadProgress={({ nativeEvent }) => {
            if (nativeEvent.url.includes('telegram.org') && nativeEvent.progress > 0.7) setLoading(false);
          }}
          onMessage={onMessage}
          onLoadEnd={() => {
            ref.current?.injectJavaScript(InjectTelegramLoginJavaScript);
          }}
          onLoadStart={onLoadStart}
        />
      </KeyboardAwareScrollView>
    </ModalBody>
  );
}

const sign = () => {
  Keyboard.dismiss();
  return new Promise<any>((resolve, reject) => {
    OverlayModal.show(<TonSign onConfirm={resolve} onReject={reject} />, {
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

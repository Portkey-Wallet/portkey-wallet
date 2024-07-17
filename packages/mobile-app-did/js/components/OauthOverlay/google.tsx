import React, { useCallback, useEffect, useRef, useState } from 'react';
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
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useCurrentNetworkInfo } from '@portkey-wallet/hooks/hooks-ca/network';
import { TGoogleAuthentication } from 'types/authentication';
import generateRandomNonce from '@portkey-wallet/utils/nonce';

import { forgeWeb } from '@portkey/utils';
import {
  openloginSignal,
  TIOpenloginSignalrHandler,
  IOpenloginSignalr,
  CrossTabPushMessageType,
} from '@portkey/socket';
import { KeyPairJSON } from '@portkey/utils/dist/commonjs/crypto/types';
import { stringify } from 'query-string';
import { randomId } from '@portkey-wallet/utils';

type GoogleProps = {
  onConfirm: (authInfo: TGoogleAuthentication) => void;
  onReject: (reason: any) => void;
};

let invokeTimer: any;

function GoogleSign({ onConfirm, onReject }: GoogleProps) {
  const [loading, setLoading] = useState(true);
  const ref = useRef<WebView>();
  const { domain, apiUrl, portkeyOpenLoginUrl } = useCurrentNetworkInfo();
  const [nonce] = useState(generateRandomNonce());
  const [loginUrl, setLoginUrl] = useState('');
  const [loginId] = useState(randomId());
  const [keyPair, setKeyPair] = useState<KeyPairJSON>();

  const generateLoginUrl = useCallback(async () => {
    // 生成公私钥对
    const cryptoManager = new forgeWeb.ForgeCryptoManager();
    const keyPairValue = await cryptoManager.generateKeyPair();
    setKeyPair(keyPairValue);

    const queryParams = {
      publicKey: keyPairValue.publicKey,
      serviceURI: 'https://aa-portkey-test.portkey.finance',
      actionType: 'login',
      loginProvider: 'Google',
      loginId,
      network: 'online',
      nonce,
    };

    const url = `${portkeyOpenLoginUrl}/social-start?${stringify({
      b64Params: Buffer.from(JSON.stringify(queryParams)).toString('base64'),
    })}`;
    setLoginUrl(url);
  }, [loginId, nonce, portkeyOpenLoginUrl]);

  useEffect(() => {
    generateLoginUrl();
  }, [generateLoginUrl]);

  useEffect(() => {
    if (loginUrl) {
    }
  }, [loginUrl]);

  const getResultByInvoke = (clientId: string, methodName: string) => {
    return new Promise(resolve => {
      if (invokeTimer) clearInterval(invokeTimer);
      invokeTimer = Number(
        setInterval(async () => {
          const result = await openloginSignal.GetTabDataAsync({
            requestId: clientId,
            methodName: methodName as any,
          });
          console.log(result, 'getResultByInvoke result===');
          if (result?.data) {
            clearInterval(invokeTimer);
            resolve(result.data);
          }
        }, 1000),
      );
    });
  };

  const onLoadStart = useCallback(({ nativeEvent }: WebViewNavigationEvent) => {
    // if (nativeEvent.url.includes(FBAuthPush)) {
    //   setLoading(false);
    // }
  }, []);
  const onMessage = useCallback(async ({ nativeEvent }: WebViewMessageEvent) => {
    const { data } = nativeEvent;
    console.log('aaaa data : ', data);
  }, []);
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
        {loginUrl && (
          <WebView
            ref={ref as any}
            source={{ uri: loginUrl }}
            originWhitelist={['*']}
            javaScriptCanOpenWindowsAutomatically={true}
            onMessage={onMessage}
            onLoadStart={onLoadStart}
          />
        )}
      </KeyboardAwareScrollView>
    </ModalBody>
  );
}

const sign = async () => {
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

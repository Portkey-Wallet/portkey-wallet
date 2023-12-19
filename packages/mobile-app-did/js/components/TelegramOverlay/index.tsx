import React, { useState } from 'react';
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

type TelegramSignProps = {
  onConfirm: (value: unknown) => void;
  onReject: (reason: any) => void;
};

const InjectedJavaScript = `(()=>{
  try {
    if(!window.opener) window.opener = {}
    window.opener.postMessage = obj => {
      window.ReactNativeWebView.postMessage(JSON.stringify(obj));
    };
  } catch (error) {
    window.ReactNativeWebView.postMessage(JSON.stringify(error));
  }
})()`;

function TelegramSign({ onConfirm }: TelegramSignProps) {
  const [loading, setLoading] = useState(true);
  return (
    <ModalBody title="Telegram Login" modalBodyType="bottom">
      <View style={styles.container}>
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
          injectedJavaScriptBeforeContentLoaded={InjectedJavaScript}
          source={{ uri: 'https://bean-go-newttt.vercel.app/telegram' }}
          onLoadProgress={({ nativeEvent }) => {
            if (nativeEvent.progress > 0.5) setLoading(false);
          }}
          onLoadStart={() => {
            console.log('onLoadStart');
          }}
          onMessage={event => {
            console.log(event, '=====event');
          }}
        />
      </View>
    </ModalBody>
  );
}

const sign = () => {
  Keyboard.dismiss();
  return new Promise((resolve, reject) => {
    OverlayModal.show(<TelegramSign onConfirm={resolve} onReject={reject} />, {
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

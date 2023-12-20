import React, { useRef, useState } from 'react';
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
import { parseUrl } from 'query-string';
import { TelegramUserInfo, parseTelegramToken } from '@portkey-wallet/utils/authentication';

type TelegramSignProps = {
  onConfirm: (userInfo: TGUserInfo) => void;
  onReject: (reason: any) => void;
};

type TGUserInfo = {
  user: TelegramUserInfo;
  accessToken: string;
};

function TelegramSign({ onConfirm, onReject }: TelegramSignProps) {
  const [loading, setLoading] = useState(true);
  const [uri, setUri] = useState('https://openlogin-test.portkey.finance/social-login/Telegram?botUsername=sTestABot');
  const ref = useRef<WebView>();
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
          ref={ref as any}
          source={{ uri }}
          onLoadProgress={({ nativeEvent }) => {
            console.log(nativeEvent.progress);
            if (nativeEvent.progress > 0.5) setLoading(false);
          }}
          onLoadStart={async ({ nativeEvent }) => {
            try {
              if (nativeEvent.url.includes('auth-callback')) {
                const parseData = parseUrl(nativeEvent.url);
                const { token } = parseData.query || {};
                if (typeof token === 'string') {
                  const userInfo: TGUserInfo = {
                    user: parseTelegramToken(token),
                    accessToken: token,
                  };
                  onConfirm(userInfo);
                  OverlayModal.hide(false);
                }
              }
            } catch (error) {
              onReject(error);
            }
          }}
          onMessage={({ nativeEvent }) => {
            console.log(nativeEvent, '=====nativeEvent');
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

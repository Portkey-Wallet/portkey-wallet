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
import { parseTelegramToken } from '@portkey-wallet/utils/authentication';
import { ThirdParty } from '@portkey-wallet/constants/constants-ca/network';
import { useCurrentNetworkInfo } from '@portkey-wallet/hooks/hooks-ca/network';

import { stringifyUrl } from 'query-string';
import { TelegramAuthentication } from 'hooks/authentication';
const oAuthTelegramURL = 'https://oauth.telegram.org/auth';
export const getTelegramAuthToken = ({
  botId,
  requestAccess = 'write',
  redirectUrl,
  origin,
  lang = 'en',
}: {
  botId: string;
  requestAccess?: string;
  redirectUrl?: string;
  lang?: string;
  origin: string;
}) => {
  return stringifyUrl(
    {
      url: oAuthTelegramURL,
      query: {
        bot_id: botId,
        request_access: requestAccess,
        origin,
        embed: 1,
        return_to: redirectUrl,
        lang,
      },
    },
    { encode: true },
  );
};

type TelegramSignProps = {
  onConfirm: (userInfo: TelegramAuthentication) => void;
  onReject: (reason: any) => void;
};

function TelegramSign({ onConfirm, onReject }: TelegramSignProps) {
  const [loading, setLoading] = useState(true);
  const { networkType } = useCurrentNetworkInfo();
  const [uri, setUri] = useState(`${ThirdParty}/social-login/Telegram?from=portkey&network=${networkType}`);
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
          onLoadStart={({ nativeEvent }) => {
            console.log(nativeEvent, '====nativeEvent');

            if (nativeEvent.url.includes('auth-callback')) {
              try {
                if (nativeEvent.url.includes('auth-callback')) {
                  const parseData = parseUrl(nativeEvent.url);
                  const { token } = parseData.query || {};
                  if (typeof token === 'string') {
                    const user = parseTelegramToken(token);
                    if (!user) return onReject(new Error('Invalid Token'));
                    const userInfo: TelegramAuthentication = {
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
          }}
        />
      </View>
    </ModalBody>
  );
}

const sign = () => {
  Keyboard.dismiss();
  return new Promise<TelegramAuthentication>((resolve, reject) => {
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

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
import { parseUrl, stringify } from 'query-string';
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
// https://localtest-applesign.portkey.finance/api/app/telegramAuth/receive/portkey
// https://localtest-applesign.portkey.finance/api/app/telegramAuth/receive/portkey

// https://localtest-applesign.portkey.finance/api/app/telegramAuth/receive/portkey?id=5592303194&first_name=mason&auth_date=1703223799&hash=6dc784c371629244b925b5cadda75c978958569e3b55d6682fb4e041a96acfa4

// https://localtest-applesign.portkey.finance/api/app/telegramAuth/receive/portkey?auth_date=1703223936&first_name=mason&hash=01938f65d304d69f945b81a09e70e666ae3bdca57e8778301915601ebdd1bcca&id=5592303194
// url: "https://oauth.telegram.org/embed/sTestABot?origin=https%3A%2F%2Fopenlogin-test.portkey.finance&return_to=https%3A%2F%2Fopenlogin-test.portkey.finance%2Fsocial-login%2FTelegram%3Ffrom%3Dportkey%26network%3DTESTNET&size=large&userpic=true&request_access=write&lang=en"

function TelegramSign({ onConfirm, onReject }: TelegramSignProps) {
  const [loading, setLoading] = useState(true);
  const { networkType } = useCurrentNetworkInfo();
  // const [uri, setUri] = useState('https://bean-go.vercel.app/telegram-auth');
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
          originWhitelist={['*']}
          javaScriptCanOpenWindowsAutomatically={true}
          onLoadProgress={({ nativeEvent }) => {
            if (nativeEvent.progress > 0.5) setLoading(false);
          }}
          onOpenWindow={(syntheticEvent: { nativeEvent: any }) => {
            const { nativeEvent } = syntheticEvent;
            console.log(nativeEvent, '====nativeEvent-onOpenWindow');
          }}
          onShouldStartLoadWithRequest={request => {
            console.log(request, '=====request');
            return true;
          }}
          onLoadStart={({ nativeEvent }) => {
            console.log(nativeEvent, '====nativeEvent');
            if (nativeEvent.url.includes('#tgAuthResult')) {
              const tgAuthResult = Buffer.from(nativeEvent.url.split('#tgAuthResult=')[1], 'base64').toString('utf8');
              setUri(
                `https://localtest-applesign.portkey.finance/api/app/telegramAuth/receive/portkey?${stringify(
                  JSON.parse(tgAuthResult),
                )}`,
              );

              // setUri(
              //   `https://localtest-applesign.portkey.finance/api/app/telegramAuth/receive${stringify(
              //     JSON.parse(tgAuthResult),
              //   )}`,
              // );
            }

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

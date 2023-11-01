import React, { useCallback, useMemo } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { BGStyles, FontStyles } from 'assets/theme/styles';
import styles from '../styles';
import Touchable from 'components/Touchable';
import GStyles from 'assets/theme/GStyles';
import { TextL } from 'components/CommonText';
import Svg from 'components/Svg';
import { pTd } from 'utils/unit';
import CommonButton from 'components/CommonButton';
import { PortkeyEntries } from 'config/entries';
import useBaseContainer from 'model/container/UseBaseContainer';
import { AccountOriginalType, isWalletExists, isWalletUnlocked } from 'model/verify/after-verify';
import CommonToast from 'components/CommonToast';
import useEffectOnce from 'hooks/useEffectOnce';
import { CheckPinProps, CheckPinResult } from 'pages/Pin/CheckPin';
import { SignInPageProps, SignInPageResult } from 'components/entries/SignIn';
import TermsServiceButton from './TermsServiceButton';
import Divider from 'components/Divider';
import { defaultColors } from 'assets/theme';
import { PageLoginType, PageType } from '../types';
import { useVerifyEntry } from 'model/verify/entry';
import { isIOS } from '@portkey-wallet/utils/mobile/device';
import { useAppleAuthentication, useGoogleAuthentication } from 'model/hooks/authentication';
import { AppleAccountInfo, GoogleAccountInfo } from 'model/verify/third-party-account';

const TitleMap = {
  [PageType.login]: {
    apple: 'Login with Apple',
    google: 'Login with Google',
    button: 'Login with Phone / Email',
  },
  [PageType.signup]: {
    apple: 'Signup with Apple',
    google: 'Signup with Google',
    button: 'Signup with Phone / Email',
  },
};

export default function Referral({
  setLoginType,
  type = PageType.login,
}: {
  setLoginType: (type: PageLoginType) => void;
  type?: PageType;
}) {
  // eslint-disable-next-line @typescript-eslint/no-empty-function

  const { appleSign } = useAppleAuthentication();
  const { googleSign } = useGoogleAuthentication();

  const appleLoginAdapter = useCallback(async (): Promise<AppleAccountInfo> => {
    const userInfo = await appleSign();
    return {
      accountIdentifier: userInfo?.user?.id,
      identityToken: userInfo?.identityToken,
    };
  }, [appleSign]);

  const googleLoginAdapter = useCallback(async (): Promise<GoogleAccountInfo> => {
    const userInfo = await googleSign();
    return {
      accountIdentifier: userInfo?.user?.id,
      accessToken: userInfo?.accessToken,
    };
  }, [googleSign]);

  const { onFinish, navigateForResult } = useBaseContainer({
    entryName: PortkeyEntries.REFERRAL_ENTRY,
  });

  const setErrorMessage = (msg?: string) => {
    if (msg) {
      CommonToast.failError(msg);
    }
  };

  const { thirdPartyLogin } = useVerifyEntry({
    type: PageType.login, // keep it
    accountOriginalType: AccountOriginalType.Apple,
    entryName: PortkeyEntries.REFERRAL_ENTRY,
    setErrorMessage,
    googleSign: googleLoginAdapter,
    appleSign: appleLoginAdapter,
  });

  const onSuccess = (text = 'You have already logged in, page close in 5 seconds') => {
    CommonToast.success(text);
    setTimeout(() => {
      onFinish({
        status: 'success',
        data: {
          finished: true,
        },
      });
    }, 5000);
  };

  const pushToSignIn = () => {
    navigateForResult<SignInPageResult, SignInPageProps>(PortkeyEntries.SIGN_IN_ENTRY, {}, res => {
      if (res.status === 'success') {
        onSuccess();
      }
    });
  };

  const pushToSignUp = () => {
    if (type === PageType.login) {
      navigateForResult<SignInPageResult, SignInPageProps>(PortkeyEntries.SIGN_UP_REFERRAL_ENTRY, {}, res => {
        if (res.status === 'success') {
          onSuccess();
        }
      });
    } else {
      navigateForResult<SignInPageResult, SignInPageProps>(PortkeyEntries.SIGN_UP_ENTRY, {}, res => {
        if (res.status === 'success') {
          onSuccess();
        }
      });
    }
  };

  useEffectOnce(() => {
    baseCheck();
  });

  const baseCheck = async () => {
    if (await isWalletExists()) {
      if (await isWalletUnlocked()) {
        onSuccess('wallet is unlocked already, this page will close in 5 seconds');
      } else {
        const tryToUnlock = async () => {
          navigateForResult<CheckPinResult, CheckPinProps>(PortkeyEntries.CHECK_PIN, {}, res => {
            if (res.status === 'success') {
              onSuccess();
            } else {
              CommonToast.failError('Try again');
              tryToUnlock();
            }
          });
        };
        tryToUnlock();
      }
    }
  };

  const onGoogleSign = useCallback(() => {
    thirdPartyLogin('google');
  }, [thirdPartyLogin]);
  const onAppleSign = useCallback(() => {
    thirdPartyLogin('apple');
  }, [thirdPartyLogin]);

  const qrcodeImage = useMemo(() => {
    if (isIOS) {
      return { uri: 'QR-code' };
    } else {
      return require('assets/image/pngs/QR-code.png');
    }
  }, []);

  return (
    <View style={[BGStyles.bg1, styles.card, GStyles.itemCenter, GStyles.spaceBetween]}>
      {type === PageType.login && (
        <Touchable style={styles.iconBox} onPress={() => setLoginType(PageLoginType.qrCode)}>
          <Image source={qrcodeImage} style={styles.iconStyle} />
        </Touchable>
      )}
      <View style={GStyles.width100}>
        <CommonButton
          type="outline"
          onPress={onGoogleSign}
          title={TitleMap[type].google}
          icon={<Svg icon="google" size={24} />}
          containerStyle={pageStyles.outlineContainerStyle}
          titleStyle={[FontStyles.font3, pageStyles.outlineTitleStyle]}
        />

        <CommonButton
          type="outline"
          onPress={onAppleSign}
          title={TitleMap[type].apple}
          icon={<Svg icon="apple" size={24} />}
          containerStyle={pageStyles.outlineContainerStyle}
          titleStyle={[FontStyles.font3, pageStyles.outlineTitleStyle]}
        />

        <Divider title="OR" inset={true} style={pageStyles.dividerStyle} />
        <CommonButton type="primary" onPress={pushToSignIn} title={TitleMap[type].button} />
      </View>
      {type === PageType.login && (
        <Touchable style={[GStyles.flexRowWrap, GStyles.itemCenter, styles.signUpTip]} onPress={pushToSignUp}>
          <TextL style={FontStyles.font3}>
            No account? <Text style={FontStyles.font4}>Sign up </Text>
          </TextL>
          <Svg size={pTd(20)} color={FontStyles.font4.color} icon="right-arrow2" />
        </Touchable>
      )}
      <TermsServiceButton />
    </View>
  );
}

const pageStyles = StyleSheet.create({
  outlineContainerStyle: {
    marginTop: 20,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: defaultColors.border1,
  },
  outlineTitleStyle: {
    marginLeft: 12,
  },
  dividerStyle: {
    marginVertical: 16,
  },
  skeleton: {
    height: '100%',
    width: '100%',
  },
});

import React, { useCallback } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { BGStyles, FontStyles } from 'assets/theme/styles';
import navigationService from 'utils/navigationService';
import styles from '../styles';
import Touchable from 'components/Touchable';
import GStyles from 'assets/theme/GStyles';
import { TextL } from 'components/CommonText';
import Svg from 'components/Svg';
import { pTd } from 'utils/unit';
import qrCode from 'assets/image/pngs/QR-code.png';
import { PageLoginType, PageType } from '../types';
import CommonButton from 'components/CommonButton';
import TermsServiceButton from './TermsServiceButton';
import { defaultColors } from 'assets/theme';
import Divider from 'components/Divider';
import CommonToast from 'components/CommonToast';
import { useAppleAuthentication, useGoogleAuthentication } from 'hooks/authentication';
import { isIos } from '@portkey-wallet/utils/mobile/device';
import { useOnLogin } from 'hooks/login';
import { LoginType } from '@portkey-wallet/types/types-ca/wallet';
import Loading from 'components/Loading';
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
  const { appleSign } = useAppleAuthentication();
  const { googleSign } = useGoogleAuthentication();

  const onLogin = useOnLogin(type === PageType.login);
  const onAppleSign = useCallback(async () => {
    try {
      Loading.show();
      const userInfo = await appleSign();
      await onLogin({
        loginAccount: userInfo.user.id,
        loginType: LoginType.Apple,
        authenticationInfo: { [userInfo.user.id]: userInfo.identityToken as string },
      });
    } catch (error) {
      CommonToast.failError(error);
    }
    Loading.hide();
  }, [appleSign, onLogin]);
  const onGoogleSign = useCallback(async () => {
    try {
      Loading.show();
      const userInfo = await googleSign();
      await onLogin({
        loginAccount: userInfo.user.id,
        loginType: LoginType.Google,
        authenticationInfo: { [userInfo.user.id]: userInfo.accessToken },
      });
    } catch (error) {
      CommonToast.failError(error);
    }
    Loading.hide();
  }, [googleSign, onLogin]);
  return (
    <View style={[BGStyles.bg1, styles.card, GStyles.itemCenter, GStyles.spaceBetween]}>
      {type === PageType.login && (
        <Touchable style={styles.iconBox} onPress={() => setLoginType(PageLoginType.qrCode)}>
          <Image source={qrCode} style={styles.iconStyle} />
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
        <CommonButton type="primary" onPress={() => setLoginType(PageLoginType.phone)} title={TitleMap[type].button} />
      </View>
      {type === PageType.login && (
        <Touchable
          style={[GStyles.flexRowWrap, GStyles.itemCenter, styles.signUpTip]}
          onPress={() => navigationService.navigate('SignupPortkey')}>
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
});

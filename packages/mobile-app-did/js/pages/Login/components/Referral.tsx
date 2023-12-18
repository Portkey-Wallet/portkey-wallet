import React, { useMemo } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { BGStyles, FontStyles } from 'assets/theme/styles';
import navigationService from 'utils/navigationService';
import styles from '../styles';
import Touchable from 'components/Touchable';
import GStyles from 'assets/theme/GStyles';
import { TextL } from 'components/CommonText';
import Svg, { IconName } from 'components/Svg';
import { pTd } from 'utils/unit';
import qrCode from 'assets/image/pngs/QR-code.png';
import { PageLoginType, PageType } from '../types';
import CommonButton from 'components/CommonButton';
import TermsServiceButton from './TermsServiceButton';
import { defaultColors } from 'assets/theme';
import Divider from 'components/Divider';
import CommonToast from 'components/CommonToast';
import { useAppleAuthentication, useGoogleAuthentication, useTelegramAuthentication } from 'hooks/authentication';
import { useOnLogin } from 'hooks/login';
import { LoginType } from '@portkey-wallet/types/types-ca/wallet';
import Loading from 'components/Loading';
import useLockCallback from '@portkey-wallet/hooks/useLockCallback';
import { isIOS } from '@portkey-wallet/utils/mobile/device';
import RoundButton from './RoundButton';
import fonts from 'assets/theme/fonts';
const TitleMap = {
  [PageType.login]: {
    apple: 'Login with Apple',
    google: 'Login with Google',
    telegram: 'Login with Telegram',
  },
  [PageType.signup]: {
    apple: 'Signup with Apple',
    google: 'Signup with Google',
    telegram: 'Signup with Telegram',
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
  const { telegramSign } = useTelegramAuthentication();

  const onLogin = useOnLogin(type === PageType.login);

  const onAppleSign = useLockCallback(async () => {
    const loadingKey = Loading.show();
    try {
      const userInfo = await appleSign();
      await onLogin({
        loginAccount: userInfo.user.id,
        loginType: LoginType.Apple,
        authenticationInfo: { [userInfo.user.id]: userInfo.identityToken as string },
      });
    } catch (error) {
      CommonToast.failError(error);
    }
    Loading.hide(loadingKey);
  }, [appleSign, onLogin]);

  const onGoogleSign = useLockCallback(async () => {
    const loadingKey = Loading.show();
    try {
      const userInfo = await googleSign();
      await onLogin({
        loginAccount: userInfo.user.id,
        loginType: LoginType.Google,
        authenticationInfo: { [userInfo.user.id]: userInfo.accessToken },
      });
    } catch (error) {
      CommonToast.failError(error);
    }
    Loading.hide(loadingKey);
  }, [googleSign, onLogin]);

  const onTelegramSign = useLockCallback(async () => {
    const loadingKey = Loading.show();
    try {
      console.log('telegramSign');
    } catch (error) {
      CommonToast.failError(error);
    }
    Loading.hide(loadingKey);
  }, [googleSign, onLogin]);

  const otherLoginTypeList = useMemo<{ icon: IconName; onPress: () => any }[]>(() => {
    return [
      {
        icon: isIOS ? 'google' : 'apple',
        onPress: isIOS ? onGoogleSign : onAppleSign,
      },
      {
        icon: 'phone-login',
        onPress: () => setLoginType(PageLoginType.phone),
      },
      {
        icon: 'email-login',
        onPress: () => setLoginType(PageLoginType.email),
      },
    ];
  }, [onAppleSign, onGoogleSign, setLoginType]);

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
          onPress={isIOS ? onAppleSign : onGoogleSign}
          title={TitleMap[type][isIOS ? 'apple' : 'google']}
          icon={<Svg icon={isIOS ? 'apple' : 'google'} size={pTd(20)} />}
          containerStyle={pageStyles.outlineContainerStyle}
          titleStyle={[FontStyles.font3, fonts.mediumFont, pageStyles.outlineTitleStyle]}
        />
        <CommonButton
          type="outline"
          onPress={onTelegramSign}
          title={TitleMap[type].telegram}
          icon={<Svg icon="telegram-blue" size={pTd(20)} />}
          containerStyle={pageStyles.outlineContainerStyle}
          titleStyle={[FontStyles.font3, fonts.mediumFont, pageStyles.outlineTitleStyle]}
        />
        <Divider title="OR" inset={true} style={pageStyles.dividerStyle} />
        <View style={[GStyles.flexRow, GStyles.flexCenter]}>
          {otherLoginTypeList.map((ele, index) => (
            <>
              {index !== 0 && <View style={pageStyles.blank} />}
              <RoundButton key={index} icon={ele.icon} onPress={ele.onPress} />
            </>
          ))}
        </View>
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
  blank: {
    width: pTd(24),
  },
});

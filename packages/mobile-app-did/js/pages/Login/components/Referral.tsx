import React, { useMemo, Fragment } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { BGStyles, FontStyles } from 'assets/theme/styles';
import navigationService from 'utils/navigationService';
import styles from '../styles';
import Touchable from 'components/Touchable';
import GStyles from 'assets/theme/GStyles';
import { TextM } from 'components/CommonText';
import Svg, { IconName } from 'components/Svg';
import { pTd } from 'utils/unit';
import qrCode from 'assets/image/pngs/QR-code.png';
import { PageLoginType, PageType } from '../types';
import TermsServiceButton from './TermsServiceButton';
import Divider from 'components/Divider';
import CommonToast from 'components/CommonToast';
import { useAuthenticationSign } from 'hooks/authentication';
import { useOnLogin } from 'hooks/login';
import { LoginType } from '@portkey-wallet/types/types-ca/wallet';
import Loading from 'components/Loading';
import useLockCallback from '@portkey-wallet/hooks/useLockCallback';
import { isIOS } from '@portkey-wallet/utils/mobile/device';
import RoundButton from './RoundButton';
import { checkIsUserCancel } from '@portkey-wallet/utils';
import OblongButton from './OblongButton';
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
  const authenticationSign = useAuthenticationSign();

  const onLogin = useOnLogin(type === PageType.login);

  const onAppleSign = useLockCallback(async () => {
    const loadingKey = Loading.show();
    try {
      const userInfo = await authenticationSign(LoginType.Apple);
      await onLogin({
        loginAccount: userInfo.user.id,
        loginType: LoginType.Apple,
        authenticationInfo: { [userInfo.user.id]: userInfo.identityToken as string },
      });
    } catch (error) {
      CommonToast.failError(error);
    }
    Loading.hide(loadingKey);
  }, [authenticationSign, onLogin]);

  const onGoogleSign = useLockCallback(async () => {
    const loadingKey = Loading.show();
    try {
      const userInfo = await authenticationSign(LoginType.Google);
      await onLogin({
        loginAccount: userInfo.user.id,
        loginType: LoginType.Google,
        authenticationInfo: { [userInfo.user.id]: userInfo.accessToken },
      });
    } catch (error) {
      CommonToast.failError(error);
    }
    Loading.hide(loadingKey);
  }, [authenticationSign, onLogin]);

  const onTelegramSign = useLockCallback(async () => {
    const loadingKey = Loading.show();
    try {
      const userInfo = await authenticationSign(LoginType.Telegram);
      await onLogin({
        loginAccount: userInfo.user.id,
        loginType: LoginType.Telegram,
        authenticationInfo: { [userInfo.user.id]: userInfo.accessToken },
      });
    } catch (error) {
      if (!checkIsUserCancel(error)) CommonToast.failError(error);
    }
    Loading.hide(loadingKey);
  }, [authenticationSign, onLogin]);

  const onTwitterSign = useLockCallback(async () => {
    const loadingKey = Loading.show();
    try {
      const userInfo = await authenticationSign(LoginType.Twitter);
      await onLogin({
        loginAccount: userInfo.user.id,
        loginType: LoginType.Twitter,
        authenticationInfo: { [userInfo.user.id]: userInfo.accessToken },
      });
    } catch (error) {
      if (!checkIsUserCancel(error)) CommonToast.failError(error);
    }
    Loading.hide(loadingKey);
  }, [authenticationSign, onLogin]);

  const onFacebookSign = useLockCallback(async () => {
    const loadingKey = Loading.show();
    try {
      const userInfo = await authenticationSign(LoginType.Facebook);
      await onLogin({
        loginAccount: userInfo.user.userId,
        loginType: LoginType.Facebook,
        authenticationInfo: { [userInfo.user.userId]: userInfo.accessToken },
      });
    } catch (error) {
      console.log(error, checkIsUserCancel(error), '======error-onFacebookSign');
      if (!checkIsUserCancel(error)) CommonToast.failError(error);
    }
    Loading.hide(loadingKey);
  }, [authenticationSign, onLogin]);

  const otherLoginTypeList = useMemo<{ icon: IconName; onPress: () => any }[]>(
    () => [
      {
        icon: isIOS ? 'google' : 'apple',
        onPress: isIOS ? onGoogleSign : onAppleSign,
      },
      {
        icon: 'twitter',
        onPress: onTwitterSign,
      },
      {
        icon: 'facebook',
        onPress: onFacebookSign,
      },
      // {
      //   icon: 'phone',
      //   onPress: () => setLoginType(PageLoginType.phone),
      // },
      {
        icon: 'email',
        onPress: () => setLoginType(PageLoginType.email),
      },
    ],
    [onAppleSign, onFacebookSign, onGoogleSign, onTwitterSign, setLoginType],
  );

  return (
    <View style={[BGStyles.bg1, styles.card, GStyles.itemCenter, GStyles.spaceBetween]}>
      {type === PageType.login && (
        <Touchable style={styles.iconBox} onPress={() => setLoginType(PageLoginType.qrCode)}>
          <Image source={qrCode} style={styles.iconStyle} />
        </Touchable>
      )}
      <View style={GStyles.width100}>
        <OblongButton
          icon={isIOS ? 'apple' : 'google'}
          title={TitleMap[type][isIOS ? 'apple' : 'google']}
          onPress={isIOS ? onAppleSign : onGoogleSign}
          style={GStyles.marginTop(40)}
        />
        <OblongButton
          icon="telegram"
          title={TitleMap[type].telegram}
          onPress={onTelegramSign}
          style={GStyles.marginTop(16)}
        />
        <Divider title="OR" inset={true} style={pageStyles.dividerStyle} />
        <View style={[GStyles.flexRow, GStyles.flexCenter]}>
          {otherLoginTypeList.map((ele, index) => (
            <Fragment key={index}>
              {index !== 0 && <View style={pageStyles.blank} />}
              <RoundButton key={index} icon={ele.icon} onPress={ele.onPress} />
            </Fragment>
          ))}
        </View>
        {type === PageType.login && (
          <Touchable
            style={[GStyles.flexRowWrap, GStyles.itemCenter, GStyles.flexCenter, styles.signUpTip]}
            onPress={() => navigationService.navigate('SignupPortkey')}>
            <TextM style={FontStyles.font3}>
              No account? <Text style={FontStyles.font4}>Sign up </Text>
            </TextM>
            <Svg size={pTd(20)} color={FontStyles.font4.color} icon="right-arrow2" />
          </Touchable>
        )}
      </View>

      <TermsServiceButton />
    </View>
  );
}

const pageStyles = StyleSheet.create({
  dividerStyle: {
    marginVertical: 16,
  },
  blank: {
    width: pTd(15),
  },
});

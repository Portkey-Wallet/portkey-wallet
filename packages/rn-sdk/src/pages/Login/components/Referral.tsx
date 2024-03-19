import React, { useMemo, Fragment } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { BGStyles, FontStyles } from 'assets/theme/styles';
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
import { useAuthenticationSign } from '../../../hooks/authentication';
import { useOnLogin } from 'hooks/login';
import { LoginType } from '@portkey-wallet/types/types-ca/wallet';
import Loading from 'components/Loading';
import useLockCallback from '@portkey-wallet/hooks/useLockCallback';
import { isIOS } from '@portkey-wallet/utils/mobile/device';
import RoundButton from './RoundButton';
import { checkIsUserCancel } from '@portkey-wallet/utils';
import OblongButton from './OblongButton';
import { navigateToForResult } from 'model/verify/entry/hooks';
import { SignInPageProps, SignInPageResult } from 'pages/Entries/SignIn';
import { PortkeyEntries } from 'config/entries';
import router from 'core/router';
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
      console.log('userInfo!!!');
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
    console.log('onGoogleSign start');
    try {
      const userInfo = await authenticationSign(LoginType.Google);
      console.log('userInfo', userInfo);
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

  const otherLoginTypeList = useMemo<{ icon: IconName; onPress: () => any }[]>(
    () => [
      {
        icon: 'email',
        onPress: () => {
          console.log('click email!!!');
          setLoginType(PageLoginType.email);
        },
      },
    ],
    [setLoginType],
  );

  const pushToSignUp = () => {
    router.navigate(PortkeyEntries.SIGN_UP_ENTRY);
  };
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
          icon={isIOS ? 'google' : 'apple'}
          title={TitleMap[type][isIOS ? 'google' : 'google']}
          onPress={isIOS ? onGoogleSign : onAppleSign}
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
            onPress={pushToSignUp}>
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

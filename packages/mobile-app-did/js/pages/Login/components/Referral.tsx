import React, { useMemo, Fragment, useCallback } from 'react';
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
import { LoginParams, useOnLogin } from 'hooks/login';
import { LoginType } from '@portkey-wallet/types/types-ca/wallet';
import Loading from 'components/Loading';
import useLockCallback from '@portkey-wallet/hooks/useLockCallback';
import { isIOS } from '@portkey-wallet/utils/mobile/device';
import RoundButton from './RoundButton';
import { checkIsUserCancel } from '@portkey-wallet/utils';
import OblongButton from './OblongButton';
import { useEntranceConfig } from 'hooks/cms';
import { useGetFormattedLoginModeList } from '@portkey-wallet/hooks/hooks-ca/cms';
import { VersionDeviceType } from '@portkey-wallet/types/types-ca/device';
import { LOGIN_TYPE_LABEL_MAP } from '@portkey-wallet/constants/verifier';
import { TLoginMode } from '@portkey-wallet/types/types-ca/cms';
import { LOGIN_GUARDIAN_TYPE_ICON } from 'constants/misc';

const TitlePrefix = {
  [PageType.login]: 'Login with',
  [PageType.signup]: 'Signup with',
};

export function useLoginModeMap(
  onLogin: (params: LoginParams) => Promise<void>,
  onEmailSign: () => void,
  onPhoneSign: () => void,
) {
  const authenticationSign = useAuthenticationSign();
  const onAppleSign = useLockCallback(async () => {
    const loadingKey = Loading.show();
    try {
      const userInfo = await authenticationSign(LoginType.Apple);
      await onLogin({
        loginAccount: userInfo.user.id,
        loginType: LoginType.Apple,
        authenticationInfo: {
          [userInfo.user.id]: userInfo.identityToken as string,
          idToken: userInfo.identityToken,
          nonce: userInfo.nonce,
        },
      });
    } catch (error) {
      CommonToast.failError(error);
    }
    Loading.hide(loadingKey);
  }, [authenticationSign, onLogin]);

  const onGoogleSign = useLockCallback(async () => {
    Loading.show();
    try {
      const userInfo = await authenticationSign(LoginType.Google);
      await onLogin({
        loginAccount: userInfo.user.id,
        loginType: LoginType.Google,
        authenticationInfo: {
          [userInfo.user.id]: userInfo.accessToken,
          idToken: userInfo.idToken,
          nonce: userInfo.nonce,
        },
      });
    } catch (error) {
      CommonToast.failError(error);
    }
    Loading.hide();
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
      if (!checkIsUserCancel(error)) CommonToast.failError(error);
    }
    Loading.hide(loadingKey);
  }, [authenticationSign, onLogin]);

  return useMemo(() => {
    return {
      [LOGIN_TYPE_LABEL_MAP[LoginType.Apple]]: {
        title: LOGIN_TYPE_LABEL_MAP[LoginType.Apple],
        icon: LOGIN_GUARDIAN_TYPE_ICON[LoginType.Apple],
        onPress: onAppleSign,
      },
      [LOGIN_TYPE_LABEL_MAP[LoginType.Google]]: {
        title: LOGIN_TYPE_LABEL_MAP[LoginType.Google],
        icon: LOGIN_GUARDIAN_TYPE_ICON[LoginType.Google],
        onPress: onGoogleSign,
      },
      [LOGIN_TYPE_LABEL_MAP[LoginType.Email]]: {
        title: LOGIN_TYPE_LABEL_MAP[LoginType.Email],
        icon: LOGIN_GUARDIAN_TYPE_ICON[LoginType.Email],
        onPress: onEmailSign,
      },
      [LOGIN_TYPE_LABEL_MAP[LoginType.Phone]]: {
        title: LOGIN_TYPE_LABEL_MAP[LoginType.Phone],
        icon: LOGIN_GUARDIAN_TYPE_ICON[LoginType.Phone],
        onPress: onPhoneSign,
      },
      [LOGIN_TYPE_LABEL_MAP[LoginType.Telegram]]: {
        title: LOGIN_TYPE_LABEL_MAP[LoginType.Telegram],
        icon: LOGIN_GUARDIAN_TYPE_ICON[LoginType.Telegram],
        onPress: onTelegramSign,
      },
      [LOGIN_TYPE_LABEL_MAP[LoginType.Facebook]]: {
        title: LOGIN_TYPE_LABEL_MAP[LoginType.Facebook],
        icon: LOGIN_GUARDIAN_TYPE_ICON[LoginType.Facebook],
        onPress: onFacebookSign,
      },
      [LOGIN_TYPE_LABEL_MAP[LoginType.Twitter]]: {
        title: LOGIN_TYPE_LABEL_MAP[LoginType.Twitter],
        icon: LOGIN_GUARDIAN_TYPE_ICON[LoginType.Twitter],
        onPress: onTwitterSign,
      },
    } as {
      [key: TLoginMode]: {
        title: string;
        icon: IconName;
        onPress: () => void;
      };
    };
  }, [onAppleSign, onEmailSign, onFacebookSign, onGoogleSign, onPhoneSign, onTelegramSign, onTwitterSign]);
}

export default function Referral({
  setLoginType,
  type = PageType.login,
}: {
  setLoginType: (type: PageLoginType) => void;
  type?: PageType;
}) {
  const onLogin = useOnLogin(type === PageType.login);

  const config = useEntranceConfig();

  const { loginModeListToRecommend, loginModeListToOther } = useGetFormattedLoginModeList(
    config,
    isIOS ? VersionDeviceType.iOS : VersionDeviceType.Android,
  );

  const loginModeMap = useLoginModeMap(
    onLogin,
    useCallback(() => setLoginType(PageLoginType.email), [setLoginType]),
    useCallback(() => setLoginType(PageLoginType.phone), [setLoginType]),
  );

  return (
    <View style={[BGStyles.bg1, styles.card, GStyles.itemCenter, GStyles.spaceBetween]}>
      {type === PageType.login && (
        <Touchable style={styles.iconBox} onPress={() => setLoginType(PageLoginType.qrCode)}>
          <Image source={qrCode} style={styles.iconStyle} />
        </Touchable>
      )}
      <View style={GStyles.width100}>
        {loginModeListToRecommend.map((ele, index) => {
          if (!ele?.type?.value) return null;
          const item = loginModeMap[ele.type.value];
          if (!item) return null;
          return (
            <OblongButton
              key={index}
              {...item}
              title={`${TitlePrefix[type]} ${item.title}`}
              style={GStyles.marginTop(index === 0 ? 40 : 16)}
            />
          );
        })}
        <Divider title="OR" inset={true} style={pageStyles.dividerStyle} />
        <View style={[GStyles.flexRow, GStyles.flexCenter]}>
          {loginModeListToOther.map((ele, index) => {
            if (!ele?.type?.value) return null;
            const item = loginModeMap[ele.type.value];
            if (!item) return null;
            return (
              <Fragment key={index}>
                {index !== 0 && <View style={pageStyles.blank} />}
                <RoundButton {...item} key={index} />
              </Fragment>
            );
          })}
        </View>
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

import React, { useState, useRef, useCallback } from 'react';
import { TextInput, View } from 'react-native';
import { handleErrorMessage } from '@portkey-wallet/utils';
import { checkEmail } from '@portkey-wallet/utils/check';
import useEffectOnce from 'hooks/useEffectOnce';
import { useLanguage } from 'i18n/hooks';
import myEvents from 'utils/deviceEvent';
import CommonInput from 'components/CommonInput';
import CommonButton from 'components/CommonButton';
import GStyles from 'assets/theme/GStyles';
import { PageType } from '../types';
import { useOnLogin } from 'hooks/login';
import useLockCallback from '@portkey-wallet/hooks/useLockCallback';
import { useInputFocus } from 'hooks/useInputFocus';
import { TextH1, TextL } from 'components/CommonText';
import { darkColors } from 'assets/theme';
import Touchable from 'components/Touchable';
import navigationService from 'utils/navigationService';
import { KeyboardSafeArea } from 'components/KeyboardSafeArea';
import { makeStyles } from '@rneui/themed';
import { pTd } from 'utils/unit';
import { screenHeight } from '@portkey-wallet/utils-mobile/device';
import fonts from 'assets/theme/fonts';

const TitleMap = {
  [PageType.login]: {
    button: 'Continue',
  },
  [PageType.signup]: {
    button: 'Continue',
  },
};

export default function Email({ type = PageType.login }: { type?: PageType }) {
  const emailStyles = styles();
  const { t } = useLanguage();
  const iptRef = useRef<TextInput>();
  useInputFocus(iptRef);
  const [loading, setLoading] = useState<boolean>(false);
  const [loginAccount, setLoginAccount] = useState<string>();
  const [errorMessage, setErrorMessage] = useState<string>();
  const onLogin = useOnLogin(type === PageType.login);

  const onPageLogin = useLockCallback(async () => {
    const message = checkEmail(loginAccount) || undefined;
    setErrorMessage(message);
    if (message) return;
    setLoading(true);
    try {
      await onLogin({ loginAccount: loginAccount as string });
    } catch (error) {
      setErrorMessage(handleErrorMessage(error));
    }
    setLoading(false);
  }, [loginAccount, onLogin]);

  useEffectOnce(() => {
    const listener = myEvents[type === PageType.login ? 'clearLoginInput' : 'clearSignupInput'].addListener(() => {
      setLoginAccount('');
      setErrorMessage(undefined);
    });
    return () => listener.remove();
  });

  const onChangeText = useCallback((val: string) => {
    setLoginAccount(val);
    setErrorMessage(undefined);
  }, []);

  return (
    <View style={[GStyles.itemCenter, emailStyles.card]}>
      <View style={[GStyles.width100, GStyles.flexCol, GStyles.spaceBetween, emailStyles.cardContent]}>
        <View style={[GStyles.width100, GStyles.flex1]}>
          <TextH1 style={emailStyles.emailTitle}>
            {type === PageType.login ? 'Log in via email' : 'Create your account'}
          </TextH1>
          <TextL style={[GStyles.marginBottom(8)]}>Email</TextL>

          <CommonInput
            ref={iptRef}
            value={loginAccount}
            type="general"
            autoCorrect={false}
            allowClear
            clearIcon="clear4"
            onChangeText={onChangeText}
            errorMessage={errorMessage}
            keyboardType="email-address"
            placeholder={t('Enter your email')}
            containerStyle={emailStyles.emailInputContainerStyle}
            inputContainerStyle={emailStyles.emailInputInputContainerStyle}
            placeholderTextColor={darkColors.textBase3}
          />
        </View>

        <KeyboardSafeArea>
          <View style={emailStyles.signUpWrap}>
            <CommonButton disabled={!loginAccount} type="primary" loading={loading} onPress={onPageLogin}>
              {t(TitleMap[type].button)}
            </CommonButton>

            {type === PageType.login ? (
              <Touchable
                style={[GStyles.flexRowWrap, GStyles.itemCenter, GStyles.flexCenter, emailStyles.signUpTip]}
                onPress={() => navigationService.navigate('SignUpEmail')}>
                <TextL style={emailStyles.signUpTipContent}>
                  Don’t have an account? <TextL style={emailStyles.signUpTipContentBold}>Sign up</TextL>
                </TextL>
              </Touchable>
            ) : (
              <Touchable
                style={[GStyles.flexRowWrap, GStyles.itemCenter, GStyles.flexCenter, emailStyles.signUpTip]}
                onPress={() => navigationService.navigate('LoginEmail')}>
                <TextL style={emailStyles.signUpTipContent}>
                  Already have an account? <TextL style={emailStyles.signUpTipContentBold}>Log in</TextL>
                </TextL>
              </Touchable>
            )}
          </View>
        </KeyboardSafeArea>
      </View>
    </View>
  );
}

const styles = makeStyles(theme => ({
  card: {
    flex: 1,
    width: '100%',
    paddingTop: pTd(24),
    paddingBottom: 0,
    minHeight: Math.min(screenHeight * 0.58, 494),
  },
  cardContent: {
    height: '100%',
  },
  emailTitle: {
    marginBottom: pTd(48),
  },
  emailInputContainerStyle: {
    width: '100%',
  },
  emailInputInputContainerStyle: {
    borderWidth: pTd(1),
    borderBottomWidth: pTd(1),
    borderRadius: pTd(8),
    borderColor: theme.colors.borderBase1,
  },
  signUpWrap: {
    paddingBottom: pTd(24),
  },
  signUpTip: {
    marginTop: pTd(16),
    height: pTd(48),
    alignContent: 'center',
    justifyContent: 'center',
  },
  signUpTipContent: {
    color: theme.colors.textBase2,
  },
  signUpTipContentBold: {
    color: theme.colors.textBrand1,
    ...fonts.mediumFont,
  },
}));

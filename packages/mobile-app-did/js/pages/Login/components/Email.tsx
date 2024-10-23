import React, { useState, useRef } from 'react';
import { TextInput, View } from 'react-native';
import { handleErrorMessage } from '@portkey-wallet/utils';
import { checkEmail } from '@portkey-wallet/utils/check';
import Loading from 'components/Loading';
import useEffectOnce from 'hooks/useEffectOnce';
import { useLanguage } from 'i18n/hooks';
import myEvents from 'utils/deviceEvent';
import styles from '../styles';
import CommonInput from 'components/CommonInput';
import CommonButton from 'components/CommonButton';
import GStyles from 'assets/theme/GStyles';
import { PageLoginType, PageType } from '../types';
import { useOnLogin } from 'hooks/login';
import useLockCallback from '@portkey-wallet/hooks/useLockCallback';
import { useInputFocus } from 'hooks/useInputFocus';
import { TextH1, TextL } from 'components/CommonText';
import { darkColors } from 'assets/theme';
import Touchable from 'components/Touchable';
import navigationService from 'utils/navigationService';
import { useTheme } from '@rneui/themed';

const TitleMap = {
  [PageType.login]: {
    button: 'Continue',
  },
  [PageType.signup]: {
    button: 'Continue',
  },
};

export default function Email({
  setLoginType,
  type = PageType.login,
}: {
  setLoginType: (type: PageLoginType) => void;
  type?: PageType;
}) {
  const emailStyles = styles();
  const { theme } = useTheme();
  const { t } = useLanguage();
  const iptRef = useRef<TextInput>();
  useInputFocus(iptRef);
  const [loading] = useState<boolean>();
  const [loginAccount, setLoginAccount] = useState<string>();
  const [errorMessage, setErrorMessage] = useState<string>();
  const onLogin = useOnLogin(type === PageType.login);

  const onPageLogin = useLockCallback(async () => {
    const message = checkEmail(loginAccount) || undefined;
    setErrorMessage(message);
    if (message) return;
    const loadingKey = Loading.show();
    try {
      await onLogin({ loginAccount: loginAccount as string });
    } catch (error) {
      setErrorMessage(handleErrorMessage(error));
    }
    Loading.hide(loadingKey);
  }, [loginAccount, onLogin]);

  useEffectOnce(() => {
    const listener = myEvents[type === PageType.login ? 'clearLoginInput' : 'clearSignupInput'].addListener(() => {
      setLoginAccount('');
      setErrorMessage(undefined);
    });
    return () => listener.remove();
  });

  return (
    <View style={[GStyles.itemCenter, emailStyles.card]}>
      <View style={[GStyles.width100, GStyles.flexCol, GStyles.spaceBetween, emailStyles.cardContent]}>
        <View style={[GStyles.width100, GStyles.flex1]}>
          <TextH1 style={emailStyles.emailTitle}>
            {type === PageType.login ? 'Log in via email' : 'Create your account'}
          </TextH1>
          <TextL style={[GStyles.marginBottom(8)]} onPress={() => setLoginType(PageLoginType.email)}>
            Email
          </TextL>
          {/* <View style={[GStyles.flexRowWrap, GStyles.marginBottom(8)]}>
            <TabButton title="Phone" style={GStyles.marginRight(8)} onPress={() => setLoginType(PageLoginType.phone)} />
            <TabButton isActive title="Email" onPress={() => setLoginType(PageLoginType.email)} />
          </View> */}

          <CommonInput
            ref={iptRef}
            value={loginAccount}
            type="general"
            autoCorrect={false}
            allowClear
            clearIcon="clear4"
            onChangeText={setLoginAccount}
            errorMessage={errorMessage}
            keyboardType="email-address"
            placeholder={t('Enter your Email')}
            containerStyle={emailStyles.emailInputContainerStyle}
            inputContainerStyle={emailStyles.emailInputInputContainerStyle}
            // inputContainerStyle={[emailStyles.emailInputInputContainerStyle, GStyles.hairlineBorder]}
            placeholderTextColor={darkColors.textBase3}
          />
        </View>
        <CommonButton
          containerStyle={GStyles.paddingBottom(32)}
          disabled={!loginAccount}
          type="primary"
          loading={loading}
          onPress={onPageLogin}>
          {t(TitleMap[type].button)}
        </CommonButton>
      </View>

      {type === PageType.login ? (
        <Touchable
          style={[GStyles.flexRowWrap, GStyles.itemCenter, GStyles.flexCenter, emailStyles.signUpTip]}
          onPress={() => navigationService.navigate('SignupPortkey')}>
          <TextL style={{ color: theme.colors.textBase2 }}>
            Don’t have an account? <TextL style={{ color: theme.colors.textBrand1 }}>Sign up</TextL>
          </TextL>
        </Touchable>
      ) : (
        <Touchable
          style={[GStyles.flexRowWrap, GStyles.itemCenter, GStyles.flexCenter, emailStyles.signUpTip]}
          onPress={() => navigationService.navigate('LoginPortkey')}>
          <TextL style={{ color: theme.colors.textBase2 }}>
            Already have an account? <TextL style={{ color: theme.colors.textBrand1 }}>Log in</TextL>
          </TextL>
        </Touchable>
      )}
    </View>
  );
}

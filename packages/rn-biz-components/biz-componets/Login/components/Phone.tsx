import React, { useState } from 'react';
import { View } from 'react-native';
import { handleErrorMessage } from '@portkey-wallet/utils';
// import { BGStyles } from 'assets/theme/styles';
import Loading from '@portkey-wallet/rn-components/components/Loading';
import useEffectOnce from '@portkey-wallet/rn-base/hooks/useEffectOnce';
import { useLanguage } from '@portkey-wallet/rn-base/i18n/hooks';
import myEvents from '@portkey-wallet/rn-base/utils/deviceEvent';
import styles from '../styles';
import CommonButton from '@portkey-wallet/rn-components/components/CommonButton';
// import GStyles from 'assets/theme/GStyles';
import { PageLoginType, PageType } from '../types';
import TermsServiceButton from './TermsServiceButton';
import TabButton from './TabButton';
import { useOnLogin } from '@portkey-wallet/rn-base/hooks/login';
// import PhoneInput from '@portkey-wallet/rn-components/components/PhoneInput';
import { LoginType } from '@portkey-wallet/types/types-ca/wallet';
import { usePhoneCountryCode } from '@portkey-wallet/hooks/hooks-ca/misc';
import useLockCallback from '@portkey-wallet/hooks/useLockCallback';
import { BGStyles } from '@portkey-wallet/rn-components/theme/styles';
import GStyles from '@portkey-wallet/rn-components/theme/GStyles';

const TitleMap = {
  [PageType.login]: {
    button: 'Log In',
  },
  [PageType.signup]: {
    button: 'Sign up',
  },
};

export default function Phone({
  setLoginType,
  type = PageType.login,
}: {
  setLoginType: (type: PageLoginType) => void;
  type?: PageType;
}) {
  const { t } = useLanguage();
  const [loading] = useState<boolean>();
  const [loginAccount, setLoginAccount] = useState<string>();
  const [errorMessage, setErrorMessage] = useState<string>();
  const { localPhoneCountryCode: country } = usePhoneCountryCode();
  const onLogin = useOnLogin(type === PageType.login);

  const onPageLogin = useLockCallback(async () => {
    const loadingKey = Loading.show();
    try {
      await onLogin({
        showLoginAccount: `+${country.code} ${loginAccount}`,
        loginAccount: `+${country.code}${loginAccount}`,
        loginType: LoginType.Phone,
      });
    } catch (error) {
      setErrorMessage(handleErrorMessage(error));
    }
    Loading.hide(loadingKey);
  }, [country.code, loginAccount, onLogin]);

  useEffectOnce(() => {
    const listener = myEvents[type === PageType.login ? 'clearLoginInput' : 'clearSignupInput'].addListener(() => {
      setLoginAccount('');
      setErrorMessage(undefined);
    });
    return () => {
      listener.remove();
    };
  });
  console.error('phone component is invalid!');
  return null;
  // return (
  //   <View style={[BGStyles.bg1, styles.card, GStyles.itemCenter]}>
  //     <View style={GStyles.width100}>
  //       <View style={[GStyles.flexRowWrap, GStyles.marginBottom(20)]}>
  //         {/* <TabButton
  //           title="Phone"
  //           isActive
  //           style={GStyles.marginRight(8)}
  //           onPress={() => setLoginType(PageLoginType.phone)}
  //         /> */}
  //         <TabButton title="Email" onPress={() => setLoginType(PageLoginType.email)} />
  //       </View>

  //       <PhoneInput
  //         value={loginAccount}
  //         errorMessage={errorMessage}
  //         containerStyle={styles.inputContainerStyle}
  //         onChangeText={setLoginAccount}
  //         selectCountry={country}
  //       />

  //       <CommonButton
  //         containerStyle={GStyles.marginTop(16)}
  //         disabled={!loginAccount}
  //         type="primary"
  //         loading={loading}
  //         onPress={onPageLogin}>
  //         {t(TitleMap[type].button)}
  //       </CommonButton>
  //     </View>
  //     <TermsServiceButton />
  //   </View>
  // );
}

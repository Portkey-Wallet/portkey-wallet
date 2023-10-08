import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { handleErrorMessage } from '@portkey-wallet/utils';
import { BGStyles } from 'assets/theme/styles';
import Loading from 'components/Loading';
import useEffectOnce from 'hooks/useEffectOnce';
import { useLanguage } from 'i18n/hooks';
import myEvents from 'utils/deviceEvent';
import styles from '../styles';
import CommonButton from 'components/CommonButton';
import GStyles from 'assets/theme/GStyles';
import { PageLoginType, PageType } from '../types';
import TermsServiceButton from './TermsServiceButton';
import Button from './Button';
// import { useOnLogin } from 'hooks/login';
import PhoneInput from 'components/PhoneInput';
import { LoginType } from '@portkey-wallet/types/types-ca/wallet';
import { usePhoneCountryCode } from '@portkey-wallet/hooks/hooks-ca/misc';
import useLockCallback from '@portkey-wallet/hooks/useLockCallback';
import { getCachedCountryCodeData, attemptAccountCheck } from 'model/sign-in';
import { CountryCodeItem } from 'types/wallet';

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
  selectedCountryCode,
}: {
  setLoginType: (type: PageLoginType) => void;
  type?: PageType;
  selectedCountryCode?: CountryCodeItem | null;
}) {
  const { t } = useLanguage();
  const [loading] = useState<boolean>();
  const [loginAccount, setLoginAccount] = useState<string>();
  const [errorMessage, setErrorMessage] = useState<string>();
  const [country, setCountry] = useState<CountryCodeItem>();
  useEffectOnce(() => {
    const countryDTO = getCachedCountryCodeData();
    setCountry(countryDTO?.locateData);
  });

  const onPageLogin = async () => {
    const loadingKey = Loading.show();
    try {
      const currentCountryCodeItem = selectedCountryCode ?? country;
      const accountCheckResult = await attemptAccountCheck(`+${currentCountryCodeItem.code}${loginAccount}`);
      if (accountCheckResult.hasRegistered) {
        console.log('aaaa');
      } else {
        console.log('bbbb');
      }
    } catch (error) {
      setErrorMessage(handleErrorMessage(error));
      Loading.hide(loadingKey);
    }
    Loading.hide(loadingKey);
  };

  return (
    <View style={[BGStyles.bg1, styles.card, GStyles.itemCenter]}>
      <View style={GStyles.width100}>
        <View style={[GStyles.flexRowWrap, GStyles.marginBottom(20)]}>
          <Button
            title="Phone"
            isActive
            style={GStyles.marginRight(8)}
            onPress={() => setLoginType(PageLoginType.phone)}
          />
          <Button title="Email" onPress={() => setLoginType(PageLoginType.email)} />
        </View>

        <PhoneInput
          value={loginAccount}
          errorMessage={errorMessage}
          containerStyle={styles.inputContainerStyle}
          onChangeText={setLoginAccount}
          selectCountry={selectedCountryCode ?? country}
        />

        <CommonButton
          containerStyle={GStyles.marginTop(16)}
          disabled={!loginAccount}
          type="primary"
          loading={loading}
          onPress={onPageLogin}>
          {t(TitleMap[type].button)}
        </CommonButton>
      </View>
      {/* <TermsServiceButton /> */}
    </View>
  );
}

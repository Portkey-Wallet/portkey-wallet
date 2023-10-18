import React, { useCallback, useState } from 'react';
import { View } from 'react-native';
import { BGStyles } from 'assets/theme/styles';
import useEffectOnce from 'hooks/useEffectOnce';
import { useLanguage } from 'i18n/hooks';
import styles from '../styles';
import CommonButton from 'components/CommonButton';
import GStyles from 'assets/theme/GStyles';
import { PageLoginType, PageType } from '../types';
import Button from './Button';
import PhoneInput from 'components/PhoneInput';
import { getCachedCountryCodeData } from 'model/global';
import { CountryCodeItem, defaultCountryCode } from 'types/wallet';
import { PortkeyEntries } from 'config/entries';
import { isWalletUnlocked } from 'model/verify/after-verify';
import useBaseContainer from 'model/container/UseBaseContainer';
import CommonToast from 'components/CommonToast';
import TermsServiceButton from './TermsServiceButton';
import { useVerifyEntry } from 'model/verify/entry';

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
  updateCountryCode,
}: {
  setLoginType: (type: PageLoginType) => void;
  type?: PageType;
  selectedCountryCode?: CountryCodeItem | null;
  updateCountryCode?: (item: CountryCodeItem) => void;
}) {
  const { t } = useLanguage();
  const [loading] = useState<boolean>();
  const [loginAccount, setLoginAccount] = useState<string>();
  const [errorMessage, setErrorMessage] = useState<string>();
  const [country, setCountry] = useState<CountryCodeItem>();

  const { navigateForResult, onFinish } = useBaseContainer({
    entryName: type === PageType.signup ? PortkeyEntries.SIGN_UP_ENTRY : PortkeyEntries.SIGN_IN_ENTRY,
    onShow: async () => {
      if (await isWalletUnlocked()) {
        CommonToast.success('You have logged in');
        onFinish({
          status: 'success',
          data: {
            finished: true,
          },
        });
      }
    },
  });

  useEffectOnce(() => {
    checkMMKVStorage();
  });

  const checkMMKVStorage = async () => {
    const countryDTO = await getCachedCountryCodeData();
    setCountry(countryDTO?.locateData);
  };

  const getWrappedPhoneNumber = useCallback(() => {
    const countryCode = (selectedCountryCode ?? country ?? defaultCountryCode)?.code;
    return `+${countryCode}${loginAccount}`;
  }, [loginAccount, country, selectedCountryCode]);

  const { verifyEntry } = useVerifyEntry({
    type,
    entryName: type === PageType.login ? PortkeyEntries.SIGN_IN_ENTRY : PortkeyEntries.SIGN_UP_ENTRY,
    setErrorMessage,
  });

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
          onCountryChange={updateCountryCode}
          selectCountry={selectedCountryCode ?? country}
          navigateForResult={navigateForResult}
        />

        <CommonButton
          containerStyle={GStyles.marginTop(16)}
          disabled={!loginAccount}
          type="primary"
          loading={loading}
          onPress={() => verifyEntry(getWrappedPhoneNumber())}>
          {t(TitleMap[type].button)}
        </CommonButton>
      </View>
      <TermsServiceButton />
    </View>
  );
}

import React, { useCallback, useEffect, useRef, useState } from 'react';
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
import ActionSheet from 'components/ActionSheet';
import { EntryResult, RouterOptions, portkeyModulesEntity } from 'service/native-modules';
import { PortkeyEntries } from 'config/entries';
import { getRegisterPageData } from 'model/sign-in';
import { AccountOriginalType, VerifiedGuardianDoc } from 'model/verify/after-verify';
import useSignUp, { SignUpConfig } from 'model/verify/sign-up';
import useBaseContainer from 'model/container/UseBaseContainer';
import { AcceptableValueType } from 'model/container/BaseContainer';
import { GuardianConfig } from 'model/verify/guardian';
import { VerifierDetailsPageProps } from 'components/entries/VerifierDetails';

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

  const [guardianConfig, setGuardianConfig] = useState<GuardianConfig>();

  useEffectOnce(() => {
    const countryDTO = getCachedCountryCodeData();
    setCountry(countryDTO?.locateData);
  });
  const getWrappedPhoneNumber = useCallback(() => {
    return `+${(selectedCountryCode ?? country).code}${loginAccount}`;
  }, [loginAccount, country, selectedCountryCode]);

  const navigateToGuardianPage = useCallback(
    (config: GuardianConfig, callback: (result: EntryResult<VerifiedGuardianDoc>) => void) => {
      navigateForResult<VerifiedGuardianDoc, VerifierDetailsPageProps>(
        PortkeyEntries.VERIFIER_DETAIL_ENTRY,
        {
          params: {
            deliveredGuardianInfo: JSON.stringify(config),
          },
        },
        callback,
      );
    },
    [],
  );

  const { isVerified, getVerifiedData, isGoogleRecaptchaOpen, sendVerifyCode, goToGuardianVerifyPage } = useSignUp({
    accountIdentifier: getWrappedPhoneNumber(),
    accountOriginalType: AccountOriginalType.Phone,
    guardianConfig,
    navigateToGuardianPage,
  });

  const { navigateForResult } = useBaseContainer({
    entryName: type === PageType.signup ? PortkeyEntries.SIGN_UP_ENTRY : PortkeyEntries.SIGN_IN_ENTRY,
  });

  const onPageLogin = async () => {
    const loadingKey = Loading.show();
    try {
      const currentCountryCodeItem = selectedCountryCode ?? country;
      const accountCheckResult = await attemptAccountCheck(`+${currentCountryCodeItem.code}${loginAccount}`);
      if (accountCheckResult.hasRegistered) {
        console.log('aaaa');
      } else {
        ActionSheet.alert({
          title: 'Continue with this account?',
          message: `This account has not been registered yet. Click "Confirm" to complete the registration.`,
          buttons: [
            { title: 'Cancel', type: 'outline' },
            {
              title: 'Confirm',
              onPress: () => {
                portkeyModulesEntity.RouterModule.navigateTo(
                  PortkeyEntries.SIGN_UP_ENTRY,
                  PortkeyEntries.SIGN_IN_ENTRY,
                );
              },
            },
          ],
        });
      }
    } catch (error) {
      setErrorMessage(handleErrorMessage(error));
      Loading.hide(loadingKey);
    }
    Loading.hide(loadingKey);
  };

  const onPageSignup = async () => {
    const loadingKey = Loading.show();
    try {
      const currentCountryCodeItem = selectedCountryCode ?? country;
      const accountCheckResult = await attemptAccountCheck(`+${currentCountryCodeItem.code}${loginAccount}`);
      if (accountCheckResult.hasRegistered) {
        ActionSheet.alert({
          title: 'Continue with this account?',
          message: `This account already exists. Click "Confirm" to log in.`,
          buttons: [
            { title: 'Cancel', type: 'outline' },
            {
              title: 'Confirm',
              onPress: () => {
                // log in
              },
            },
          ],
        });
      } else {
        // sign up
        const accountIdentifier = `+${(selectedCountryCode ?? country).code}${loginAccount}`;
        const pageData = await getRegisterPageData(accountIdentifier, AccountOriginalType.Phone);
        setGuardianConfig(pageData.guardianConfig);
        // wait for setState() finish

        // if (pageDataResult) {
        //   Loading.hide(loadingKey);
        //   portkeyModulesEntity.RouterModule.navigateToWithOptions(
        //     PortkeyEntries.VERIFIER_DETAIL_ENTRY,
        //     PortkeyEntries.SIGN_UP_ENTRY,
        //     pageDataResult,
        //     () => {},
        //   );
        // }
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
          onPress={type === PageType.login ? onPageLogin : onPageSignup}>
          {t(TitleMap[type].button)}
        </CommonButton>
      </View>
      {/* <TermsServiceButton /> */}
    </View>
  );
}

import React, { useCallback, useState } from 'react';
import { View } from 'react-native';
import { handleErrorMessage } from '@portkey-wallet/utils';
import { BGStyles } from 'assets/theme/styles';
import Loading from 'components/Loading';
import useEffectOnce from 'hooks/useEffectOnce';
import { useLanguage } from 'i18n/hooks';
import styles from '../styles';
import CommonButton from 'components/CommonButton';
import GStyles from 'assets/theme/GStyles';
import { PageLoginType, PageType } from '../types';
import Button from './Button';
import PhoneInput from 'components/PhoneInput';
import { getCachedCountryCodeData, attemptAccountCheck } from 'model/sign-in';
import { CountryCodeItem, defaultCountryCode } from 'types/wallet';
import ActionSheet from 'components/ActionSheet';
import { EntryResult } from 'service/native-modules';
import { PortkeyEntries } from 'config/entries';
import { getRegisterPageData } from 'model/sign-in';
import { AccountOriginalType, VerifiedGuardianDoc } from 'model/verify/after-verify';
import useSignUp from 'model/verify/sign-up';
import useBaseContainer from 'model/container/UseBaseContainer';
import { GuardianConfig } from 'model/verify/guardian';
import { VerifierDetailsPageProps } from 'components/entries/VerifierDetails';
import { verifyHumanMachine } from 'components/VerifyHumanMachine';

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

  const [guardianConfig, setGuardianConfig] = useState<GuardianConfig>();

  const { navigateForResult } = useBaseContainer({
    entryName: type === PageType.signup ? PortkeyEntries.SIGN_UP_ENTRY : PortkeyEntries.SIGN_IN_ENTRY,
  });

  useEffectOnce(() => {
    const countryDTO = getCachedCountryCodeData();
    setCountry(countryDTO?.locateData);
  });
  const getWrappedPhoneNumber = useCallback(() => {
    const countryCode = (selectedCountryCode ?? country ?? defaultCountryCode)?.code;
    return `+${countryCode}${loginAccount}`;
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
    [navigateForResult],
  );

  const { isGoogleRecaptchaOpen, sendVerifyCode, handleGuardianVerifyPage } = useSignUp({
    accountIdentifier: getWrappedPhoneNumber(),
    accountOriginalType: AccountOriginalType.Phone,
    guardianConfig,
    navigateToGuardianPage,
  });

  const onPageLogin = async () => {
    const loadingKey = Loading.show();
    try {
      const currentCountryCodeItem = selectedCountryCode ?? country ?? defaultCountryCode;
      const accountCheckResult = await attemptAccountCheck(`+${currentCountryCodeItem.code}${loginAccount}`);
      if (accountCheckResult.hasRegistered) {
        // log in
      } else {
        ActionSheet.alert({
          title: 'Continue with this account?',
          message: `This account has not been registered yet. Click "Confirm" to complete the registration.`,
          buttons: [
            { title: 'Cancel', type: 'outline' },
            {
              title: 'Confirm',
              onPress: () => {
                dealWithSignUp();
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
      const currentCountryCodeItem = selectedCountryCode ?? country ?? defaultCountryCode;
      Loading.show();
      const accountCheckResult = await attemptAccountCheck(`+${currentCountryCodeItem.code}${loginAccount}`);
      Loading.hide();
      if (accountCheckResult.hasRegistered) {
        ActionSheet.alert({
          title: 'Continue with this account?',
          message: `This account already exists. Click "Confirm" to log in.`,
          buttons: [
            { title: 'Cancel', type: 'outline' },
            {
              title: 'Confirm',
              onPress: () => {
                dealWithSignIn();
              },
            },
          ],
        });
      } else {
        dealWithSignUp();
      }
    } catch (error) {
      setErrorMessage(handleErrorMessage(error));
      Loading.hide(loadingKey);
    }
    Loading.hide(loadingKey);
  };

  const dealWithSignUp = async (): Promise<void> => {
    Loading.show();
    const accountIdentifier = getWrappedPhoneNumber();
    const pageData = await getRegisterPageData(accountIdentifier, AccountOriginalType.Phone, navigateToGuardianPage);
    setGuardianConfig(pageData.guardianConfig);
    Loading.hide();
    ActionSheet.alert({
      title: '',
      message: `${
        pageData.guardianConfig?.name ?? 'Portkey'
      } will send a verification code to ${accountIdentifier} to verify your phone number.`,
      buttons: [
        { title: 'Cancel', type: 'outline' },
        {
          title: 'Confirm',
          onPress: async () => {
            try {
              Loading.show();
              const needRecaptcha = await isGoogleRecaptchaOpen();
              let token: string | undefined;
              if (needRecaptcha) {
                token = (await verifyHumanMachine('en')) as string;
              }
              const sendSuccess = await sendVerifyCode(pageData.guardianConfig, token);
              if (sendSuccess) {
                const guardianResult = await handleGuardianVerifyPage();
                if (!guardianResult) {
                  setErrorMessage('guardian verify failed, please try again.');
                  Loading.hide();
                  return;
                } else {
                  dealWithSignIn();
                }
              } else {
                setErrorMessage('network fail.');
                Loading.hide();
              }
            } catch (e) {
              setErrorMessage(handleErrorMessage(e));
              Loading.hide();
            }
          },
        },
      ],
    });
  };

  const dealWithSignIn = () => {
    console.warn(`dealWithSignIn`);
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
          onCountryChange={updateCountryCode}
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

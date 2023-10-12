import React, { useCallback, useState } from 'react';
import { View } from 'react-native';
import { handleErrorMessage, randomId } from '@portkey-wallet/utils';
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
import {
  getCachedCountryCodeData,
  attemptAccountCheck,
  getSocialRecoveryPageData,
  guardianTypeStrToEnum,
} from 'model/global';
import { CountryCodeItem, defaultCountryCode } from 'types/wallet';
import ActionSheet from 'components/ActionSheet';
import { PortkeyEntries } from 'config/entries';
import { getRegisterPageData } from 'model/global';
import {
  AccountOriginalType,
  AfterVerifiedConfig,
  VerifiedGuardianDoc,
  defaultExtraData,
  isTempWalletExist,
} from 'model/verify/after-verify';
import useSignUp from 'model/verify/sign-up';
import useBaseContainer from 'model/container/UseBaseContainer';
import { GuardianConfig } from 'model/verify/guardian';
import { VerifierDetailsPageProps } from 'components/entries/VerifierDetails';
import { verifyHumanMachine } from 'components/VerifyHumanMachine';
import { VerifyPageResult } from 'pages/Guardian/VerifierDetails';
import { GuardianApprovalPageProps, GuardianApprovalPageResult } from 'components/entries/GuardianApproval';
import CommonToast from 'components/CommonToast';
import { SetPinPageResult, SetPinPageProps } from 'pages/Pin/SetPin';
import AElf from 'aelf-sdk';
import { PortkeyConfig } from 'global';

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

  const { navigateForResult, onFinish } = useBaseContainer({
    entryName: type === PageType.signup ? PortkeyEntries.SIGN_UP_ENTRY : PortkeyEntries.SIGN_IN_ENTRY,
    onShow: () => {
      if (isTempWalletExist()) {
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
    const countryDTO = getCachedCountryCodeData();
    setCountry(countryDTO?.locateData);
  });
  const getWrappedPhoneNumber = useCallback(() => {
    const countryCode = (selectedCountryCode ?? country ?? defaultCountryCode)?.code;
    return `+${countryCode}${loginAccount}`;
  }, [loginAccount, country, selectedCountryCode]);

  const navigateToGuardianPage = useCallback(
    (config: GuardianConfig, callback: (result: VerifiedGuardianDoc) => void) => {
      navigateForResult<VerifyPageResult, VerifierDetailsPageProps>(
        PortkeyEntries.VERIFIER_DETAIL_ENTRY,
        {
          params: {
            deliveredGuardianInfo: JSON.stringify(config),
          },
        },
        res => {
          Loading.hide();
          const { data } = res;
          callback(data?.verifiedData ? JSON.parse(data.verifiedData) : null);
        },
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
        dealWithSignIn();
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
              if (!pageData.guardianConfig) throw new Error('network failure');
              const needRecaptcha = await isGoogleRecaptchaOpen();
              let token: string | undefined;
              if (needRecaptcha) {
                token = (await verifyHumanMachine('en')) as string;
              }
              const sendResult = await sendVerifyCode(pageData.guardianConfig, token);
              Loading.hide();
              if (sendResult) {
                const guardianResult = await handleGuardianVerifyPage(
                  Object.assign({}, pageData.guardianConfig, {
                    verifySessionId: sendResult.verifierSessionId,
                  } as Partial<GuardianConfig>),
                  true,
                );
                if (!guardianResult) {
                  setErrorMessage('guardian verify failed, please try again.');
                  return;
                } else {
                  dealWithSetPin(getSignUpVerifiedData(pageData.guardianConfig, guardianResult));
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

  const dealWithSetPin = (afterVerifiedData: AfterVerifiedConfig | string) => {
    navigateForResult<SetPinPageResult, SetPinPageProps>(
      PortkeyEntries.SET_PIN,
      {
        params: {
          deliveredSetPinInfo:
            typeof afterVerifiedData === 'string' ? afterVerifiedData : JSON.stringify(afterVerifiedData),
        },
      },
      res => {
        const { data } = res;
        if (data.finished) {
          onFinish({
            status: 'success',
            data: {
              finished: true,
            },
          });
        }
      },
    );
  };

  const getSignUpVerifiedData = (config: GuardianConfig, verifiedData: VerifiedGuardianDoc): AfterVerifiedConfig => {
    const wallet = AElf.wallet.createNewWallet();
    const { address } = wallet;
    return {
      fromRecovery: false,
      accountIdentifier: loginAccount,
      chainId: PortkeyConfig.currChainId(),
      manager: address,
      context: {
        clientId: address,
        requestId: randomId(),
      },
      extraData: defaultExtraData,
      verifiedGuardians: [
        {
          type: guardianTypeStrToEnum(config.sendVerifyCodeParams.type),
          identifier: loginAccount,
          verifierId: config.sendVerifyCodeParams.verifierId,
          verificationDoc: verifiedData.verificationDoc,
          signature: verifiedData.signature,
        },
      ],
    } as AfterVerifiedConfig;
  };

  const dealWithSignIn = async () => {
    Loading.show();
    try {
      const signInPageData = await getSocialRecoveryPageData(getWrappedPhoneNumber(), AccountOriginalType.Phone);
      if (signInPageData) {
        navigateForResult<GuardianApprovalPageResult, GuardianApprovalPageProps>(
          PortkeyEntries.GUARDIAN_APPROVAL_ENTRY,
          {
            params: {
              deliveredGuardianListInfo: JSON.stringify(signInPageData),
            },
          },
          res => {
            Loading.hide();
            const { data } = res;
            if (data.isVerified && data.deliveredVerifiedData) {
              dealWithSetPin(data.deliveredVerifiedData);
            } else {
              setErrorMessage('guardian verify failed, please try again.');
            }
          },
        );
      } else {
        setErrorMessage('network fail.');
        Loading.hide();
      }
    } catch (e) {
      setErrorMessage(handleErrorMessage(e));
      Loading.hide();
    }
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
          navigateForResult={navigateForResult}
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

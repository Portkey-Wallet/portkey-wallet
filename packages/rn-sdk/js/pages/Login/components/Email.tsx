import React, { useState, useRef, useCallback } from 'react';
import { View } from 'react-native';
import { handleErrorMessage } from '@portkey-wallet/utils';
import { checkEmail } from '@portkey-wallet/utils/check';
import { BGStyles } from 'assets/theme/styles';
import Loading from 'components/Loading';
import { useLanguage } from 'i18n/hooks';
import styles from '../styles';
import CommonInput from 'components/CommonInput';
import CommonButton from 'components/CommonButton';
import GStyles from 'assets/theme/GStyles';
import { PageLoginType, PageType } from '../types';
import Button from './Button';
import useLockCallback from '@portkey-wallet/hooks/useLockCallback';
import { attemptAccountCheck, getRegisterPageData, getSocialRegisterPageData } from 'model/sign-in';
import ActionSheet from 'components/ActionSheet';
import { verifyHumanMachine } from 'components/VerifyHumanMachine';
import { AccountOriginalType, VerifiedGuardianDoc } from 'model/verify/after-verify';
import { VerifierDetailsPageProps } from 'components/entries/VerifierDetails';
import { PortkeyEntries } from 'config/entries';
import { GuardianConfig } from 'model/verify/guardian';
import useBaseContainer from 'model/container/UseBaseContainer';
import useSignUp from 'model/verify/sign-up';
import { VerifyPageResult } from 'pages/Guardian/VerifierDetails';
import { GuardianApprovalPageResult, GuardianApprovalPageProps } from 'components/entries/GuardianApproval';

const TitleMap = {
  [PageType.login]: {
    button: 'Log In',
  },
  [PageType.signup]: {
    button: 'Sign up',
  },
};

export default function Email({
  setLoginType,
  type = PageType.login,
}: {
  setLoginType: (type: PageLoginType) => void;
  type?: PageType;
}) {
  const { t } = useLanguage();
  const iptRef = useRef<any>();
  const [loading] = useState<boolean>();
  const [loginAccount, setLoginAccount] = useState<string>();
  const [errorMessage, setErrorMessage] = useState<string>();
  const [guardianConfig, setGuardianConfig] = useState<GuardianConfig>();

  const { navigateForResult, navigationTo } = useBaseContainer({
    entryName: type === PageType.signup ? PortkeyEntries.SIGN_UP_ENTRY : PortkeyEntries.SIGN_IN_ENTRY,
  });
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
          console.error('res', res);
          const { data } = res;
          callback(data?.verifiedData ? JSON.parse(data.verifiedData) : null);
        },
      );
    },
    [navigateForResult],
  );

  const { isGoogleRecaptchaOpen, sendVerifyCode, handleGuardianVerifyPage } = useSignUp({
    accountIdentifier: loginAccount ?? '',
    accountOriginalType: AccountOriginalType.Phone,
    guardianConfig,
    navigateToGuardianPage,
  });

  const onPageLogin = useLockCallback(async () => {
    const message = checkEmail(loginAccount) || undefined;
    setErrorMessage(message);
    if (message) return;
    const loadingKey = Loading.show();
    try {
      const accountCheckResult = await attemptAccountCheck(loginAccount as string);
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
  }, [loginAccount]);

  const onPageSignup = useLockCallback(async () => {
    const message = checkEmail(loginAccount) || undefined;
    setErrorMessage(message);
    if (message) return;
    const loadingKey = Loading.show();
    try {
      const accountCheckResult = await attemptAccountCheck(loginAccount as string);
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
  }, [loginAccount]);

  const dealWithSignIn = async () => {
    Loading.show();
    try {
      const signInPageData = await getSocialRegisterPageData(loginAccount ?? '', AccountOriginalType.Phone);
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
            if (data.isVerified) {
              dealWithSetPin();
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

  const dealWithSetPin = () => {
    navigationTo(PortkeyEntries.CHECK_PIN);
  };

  const dealWithSignUp = async () => {
    const accountIdentifier = loginAccount as string;
    if (!accountIdentifier) throw new Error('accountIdentifier is empty');
    Loading.show();
    const pageData = await getRegisterPageData(accountIdentifier, AccountOriginalType.Email, navigateToGuardianPage);
    setGuardianConfig(pageData.guardianConfig);
    Loading.hide();
    ActionSheet.alert({
      title: '',
      message: `${
        pageData.guardianConfig?.name ?? 'Portkey'
      } will send a verification code to ${accountIdentifier} to verify your email.`,
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
                  Loading.hide();
                  return;
                } else {
                  dealWithSetPin();
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

  const handleEmailChange = (msg: string) => {
    setLoginAccount(msg);
    setErrorMessage(undefined);
  };

  return (
    <View style={[BGStyles.bg1, styles.card, GStyles.itemCenter]}>
      <View style={GStyles.width100}>
        <View style={[GStyles.flexRowWrap, GStyles.marginBottom(20)]}>
          <Button title="Phone" style={GStyles.marginRight(8)} onPress={() => setLoginType(PageLoginType.phone)} />
          <Button isActive title="Email" onPress={() => setLoginType(PageLoginType.email)} />
        </View>
        <CommonInput
          ref={iptRef}
          value={loginAccount}
          type="general"
          autoCorrect={false}
          onChangeText={handleEmailChange}
          errorMessage={errorMessage}
          keyboardType="email-address"
          placeholder={t('Enter Email')}
          containerStyle={styles.inputContainerStyle}
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
    </View>
  );
}

import { handleErrorMessage } from '@portkey-wallet/utils';
import ActionSheet from 'components/ActionSheet';
import Loading from 'components/Loading';
import { verifyHumanMachine } from 'components/VerifyHumanMachine';
import { GuardianApprovalPageResult, GuardianApprovalPageProps } from 'components/entries/GuardianApproval';
import { PortkeyEntries } from 'config/entries';
import {
  attemptAccountCheck,
  getSocialRecoveryPageData,
  getRegisterPageData,
  guardianTypeStrToEnum,
} from 'model/global';
import { SetPinPageResult, SetPinPageProps } from 'pages/Pin/SetPin';
import { AccountOriginalType, AfterVerifiedConfig, VerifiedGuardianDoc, defaultExtraData } from '../after-verify';
import { GuardianConfig } from '../guardian';
import useBaseContainer from 'model/container/UseBaseContainer';
import { SendVerifyCodeResultDTO } from 'network/dto/guardian';
import { OperationTypeEnum } from '@portkey-wallet/types/verifier';
import { NetworkController } from 'network/controller';
import { PortkeyConfig } from 'global';
import { VerifierDetailsPageProps } from 'components/entries/VerifierDetails';
import { VerifyPageResult } from 'pages/Guardian/VerifierDetails';
import { useCallback } from 'react';
import { PageType } from 'pages/Login/types';

export const useVerifyEntry = (verifyConfig: VerifyConfig): VerifyEntryHooks => {
  const { type, entryName, setErrorMessage, verifyAccountIdentifier } = verifyConfig;

  const { navigateForResult, onFinish } = useBaseContainer({
    entryName,
  });
  const isGoogleRecaptchaOpen = async () => {
    return await NetworkController.isGoogleRecaptchaOpen(OperationTypeEnum.register);
  };

  const verifyEntry = (accountIdentifier: string) => {
    if (type === PageType.login) {
      onPageLogin(accountIdentifier);
    } else if (type === PageType.signup) {
      onPageSignUp(accountIdentifier);
    }
  };

  const sendVerifyCode = async (
    guardianConfig: GuardianConfig | undefined,
    googleRecaptchaToken?: string,
  ): Promise<SendVerifyCodeResultDTO | null> => {
    if (!guardianConfig) throw new Error('guardianConfig is not defined');
    const needGoogleRecaptcha = await NetworkController.isGoogleRecaptchaOpen(
      guardianConfig.sendVerifyCodeParams.operationType,
    );
    if (needGoogleRecaptcha && !googleRecaptchaToken) {
      console.warn('Need google recaptcha! Better check it before calling this function.');
      return null;
    }
    const result = await NetworkController.sendVerifyCode(
      guardianConfig.sendVerifyCodeParams,
      googleRecaptchaToken ? { reCaptchaToken: googleRecaptchaToken } : {},
    );
    if (result?.verifierSessionId) {
      return result;
    } else {
      return null;
    }
  };

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

  const handleGuardianVerifyPage = async (
    guardianConfig: GuardianConfig,
    alreadySent?: boolean,
  ): Promise<VerifiedGuardianDoc | null> => {
    if (!guardianConfig) {
      console.error('guardianConfig is not defined.');
      return null;
    }
    return new Promise(resolve => {
      navigateToGuardianPage(Object.assign({}, guardianConfig, { alreadySent: alreadySent ?? false }), result => {
        if (result) {
          resolve(result);
        } else {
          resolve(null);
        }
      });
    });
  };

  const onPageLogin = async (accountIdentifier: string) => {
    if (verifyAccountIdentifier) {
      const message = verifyAccountIdentifier(accountIdentifier) || undefined;
      setErrorMessage(message);
      if (message) return;
    }
    const loadingKey = Loading.show();
    try {
      const accountCheckResult = await attemptAccountCheck(accountIdentifier as string);
      if (accountCheckResult.hasRegistered) {
        dealWithSignIn(accountIdentifier);
      } else {
        ActionSheet.alert({
          title: 'Continue with this account?',
          message: `This account has not been registered yet. Click "Confirm" to complete the registration.`,
          buttons: [
            { title: 'Cancel', type: 'outline' },
            {
              title: 'Confirm',
              onPress: () => {
                dealWithSignUp(accountIdentifier);
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

  const onPageSignUp = async (accountIdentifier: string) => {
    if (verifyAccountIdentifier) {
      const message = verifyAccountIdentifier(accountIdentifier) || undefined;
      setErrorMessage(message);
      if (message) return;
    }
    const loadingKey = Loading.show();
    try {
      const accountCheckResult = await attemptAccountCheck(accountIdentifier as string);
      if (accountCheckResult.hasRegistered) {
        ActionSheet.alert({
          title: 'Continue with this account?',
          message: `This account already exists. Click "Confirm" to log in.`,
          buttons: [
            { title: 'Cancel', type: 'outline' },
            {
              title: 'Confirm',
              onPress: () => {
                dealWithSignIn(accountIdentifier);
              },
            },
          ],
        });
      } else {
        dealWithSignUp(accountIdentifier);
      }
    } catch (error) {
      setErrorMessage(handleErrorMessage(error));
      Loading.hide(loadingKey);
    }
    Loading.hide(loadingKey);
  };

  const dealWithSignIn = async (accountIdentifier: string) => {
    Loading.show();
    try {
      const signInPageData = await getSocialRecoveryPageData(accountIdentifier ?? '', AccountOriginalType.Email);
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

  const getSignUpVerifiedData = async (
    accountIdentifier: string,
    config: GuardianConfig,
    verifiedData: VerifiedGuardianDoc,
  ): Promise<AfterVerifiedConfig> => {
    return {
      fromRecovery: false,
      accountIdentifier,
      chainId: await PortkeyConfig.currChainId(),
      extraData: defaultExtraData,
      verifiedGuardians: [
        {
          type: guardianTypeStrToEnum(config.sendVerifyCodeParams.type),
          identifier: accountIdentifier,
          verifierId: config.sendVerifyCodeParams.verifierId,
          verificationDoc: verifiedData.verificationDoc,
          signature: verifiedData.signature,
        },
      ],
    } as AfterVerifiedConfig;
  };

  const dealWithSignUp = async (accountIdentifier: string) => {
    if (!accountIdentifier) throw new Error('accountIdentifier is empty');
    Loading.show({
      text: 'Assigning a verifier on-chain...',
    });
    const pageData = await getRegisterPageData(accountIdentifier, AccountOriginalType.Email, navigateToGuardianPage);
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
                  Loading.hide();
                  return;
                } else {
                  dealWithSetPin(
                    await getSignUpVerifiedData(accountIdentifier, pageData.guardianConfig, guardianResult),
                  );
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

  return {
    verifyEntry,
  };
};

export interface VerifyEntryHooks {
  verifyEntry: (accountIdentifier: string) => void;
}

export interface VerifyConfig {
  type: PageType;
  entryName: PortkeyEntries;
  setErrorMessage: (context: any) => void;
  verifyAccountIdentifier?: (account: string) => string | void;
}

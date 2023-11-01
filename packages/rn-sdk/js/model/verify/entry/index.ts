import { handleErrorMessage } from '@portkey-wallet/utils';
import ActionSheet from 'components/ActionSheet';
import Loading from 'components/Loading';
import { verifyHumanMachine } from 'components/VerifyHumanMachine';
import { PortkeyEntries } from 'config/entries';
import {
  attemptAccountCheck,
  getSocialRecoveryPageData,
  getRegisterPageData,
  guardianTypeStrToEnum,
} from 'model/global';
import { SetPinPageResult, SetPinPageProps } from 'pages/Pin/SetPin';
import { AccountOriginalType, AfterVerifiedConfig, VerifiedGuardianDoc, DefaultExtraData } from '../after-verify';
import { GuardianConfig } from '../guardian';
import useBaseContainer from 'model/container/UseBaseContainer';
import { SendVerifyCodeResultDTO } from 'network/dto/guardian';
import { OperationTypeEnum } from '@portkey-wallet/types/verifier';
import { NetworkController } from 'network/controller';
import { PortkeyConfig } from 'global/constants';
import { VerifierDetailsPageProps } from 'components/entries/VerifierDetails';
import { VerifyPageResult } from 'pages/Guardian/VerifierDetails';
import { useCallback } from 'react';
import { PageType } from 'pages/Login/types';
import { AppleAccountInfo, GoogleAccountInfo, ThirdPartyAccountInfo, isAppleLogin } from '../third-party-account';
import { GuardianApprovalPageProps, GuardianApprovalPageResult } from 'components/entries/GuardianApproval';

export const useVerifyEntry = (verifyConfig: VerifyConfig): VerifyEntryHooks => {
  const { type, entryName, accountOriginalType, setErrorMessage, verifyAccountIdentifier, appleSign, googleSign } =
    verifyConfig;

  const { navigateForResult, onFinish } = useBaseContainer({
    entryName,
  });
  const isGoogleRecaptchaOpen = async () => {
    return await NetworkController.isGoogleRecaptchaOpen(OperationTypeEnum.register);
  };

  const verifyEntry = (accountIdentifier: string, thirdPartyAccountInfo?: ThirdPartyAccountInfo) => {
    if (type === PageType.login) {
      onPageLogin(accountIdentifier, thirdPartyAccountInfo);
    } else if (type === PageType.signup) {
      onPageSignUp(accountIdentifier, thirdPartyAccountInfo);
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

  const thirdPartyLogin = async (thirdPartyLoginType: 'google' | 'apple'): Promise<void> => {
    if (!appleSign || !googleSign) {
      throw new Error('appleSign or googleSign is not defined.');
    }
    try {
      Loading.show();
      const thirdPartyAccountInfo = thirdPartyLoginType === 'google' ? await googleSign() : await appleSign();
      if (!thirdPartyAccountInfo?.accountIdentifier) {
        throw new Error('login failed.');
      }
      const accountIdentifier = thirdPartyAccountInfo.accountIdentifier;
      const accountCheckResult = await attemptAccountCheck(accountIdentifier as string);
      const thirdPartyInfo: ThirdPartyAccountInfo = isAppleLogin(thirdPartyAccountInfo)
        ? { apple: thirdPartyAccountInfo }
        : { google: thirdPartyAccountInfo };
      if (accountCheckResult.hasRegistered) {
        dealWithSignIn(accountIdentifier, thirdPartyInfo);
      } else {
        dealWithSignUp(accountIdentifier, thirdPartyInfo);
      }
    } catch (e) {
      console.error(e);
      setErrorMessage('login failed.');
      Loading.hide();
    }
  };

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

  const onPageLogin = async (accountIdentifier: string, thirdPartyAccountInfo?: ThirdPartyAccountInfo) => {
    if (verifyAccountIdentifier) {
      const message = verifyAccountIdentifier(accountIdentifier) || undefined;
      setErrorMessage(message);
      if (message) return;
    }
    const loadingKey = Loading.show();
    try {
      const accountCheckResult = await attemptAccountCheck(accountIdentifier as string);
      if (accountCheckResult.hasRegistered) {
        dealWithSignIn(accountIdentifier, thirdPartyAccountInfo);
      } else {
        ActionSheet.alert({
          title: 'Continue with this account?',
          message: `This account has not been registered yet. Click "Confirm" to complete the registration.`,
          buttons: [
            { title: 'Cancel', type: 'outline' },
            {
              title: 'Confirm',
              onPress: () => {
                dealWithSignUp(accountIdentifier, thirdPartyAccountInfo);
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

  const onPageSignUp = async (accountIdentifier: string, thirdPartyAccountInfo?: ThirdPartyAccountInfo) => {
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
        dealWithSignUp(accountIdentifier, thirdPartyAccountInfo);
      }
    } catch (error) {
      setErrorMessage(handleErrorMessage(error));
      Loading.hide(loadingKey);
    }
    Loading.hide(loadingKey);
  };

  const dealWithSignIn = async (accountIdentifier: string, thirdPartyAccountInfo?: ThirdPartyAccountInfo) => {
    Loading.show();
    try {
      const signInPageData = await getSocialRecoveryPageData(
        accountIdentifier ?? '',
        accountOriginalType,
        thirdPartyAccountInfo,
      );
      Loading.hide();
      if (signInPageData?.guardians?.length > 0) {
        navigateForResult<GuardianApprovalPageResult, GuardianApprovalPageProps>(
          PortkeyEntries.GUARDIAN_APPROVAL_ENTRY,
          {
            params: {
              deliveredGuardianListInfo: JSON.stringify(signInPageData),
            },
          },
          res => {
            const { data } = res || {};
            const { deliveredVerifiedData } = data || {};
            if (!deliveredVerifiedData) {
              setErrorMessage('verification failed, please try again.');
              return;
            } else {
              dealWithSetPin(deliveredVerifiedData);
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
      normalVerifyPathInfo: {
        fromRecovery: false,
        accountIdentifier,
        chainId: await PortkeyConfig.currChainId(),
        extraData: DefaultExtraData,
        verifiedGuardians: [
          {
            type: guardianTypeStrToEnum(config.sendVerifyCodeParams.type),
            identifier: accountIdentifier,
            verifierId: config.sendVerifyCodeParams.verifierId,
            verificationDoc: verifiedData.verificationDoc,
            signature: verifiedData.signature,
          },
        ],
      },
    };
  };

  const dealWithSignUp = async (accountIdentifier: string, thirdPartyAccountInfo?: ThirdPartyAccountInfo) => {
    if (!accountIdentifier) throw new Error('accountIdentifier is empty');
    Loading.show({
      text: 'Assigning a verifier on-chain...',
    });
    const { google, apple } = thirdPartyAccountInfo || {};
    const useThirdPartyFunction = google || apple;
    try {
      if (useThirdPartyFunction) {
        const recommendedGuardian = await NetworkController.getRecommendedGuardian();
        Loading.hide();
        const { id } = recommendedGuardian || {};
        if (!id) {
          throw new Error('network failure');
        }
        const guardianResult = google
          ? await NetworkController.verifyGoogleGuardianInfo({
              verifierId: id,
              accessToken: google.accessToken,
              operationType: OperationTypeEnum.register,
              chainId: await PortkeyConfig.currChainId(),
            })
          : await NetworkController.verifyAppleGuardianInfo({
              verifierId: id,
              accessToken: apple?.identityToken ?? '',
              operationType: OperationTypeEnum.register,
              chainId: await PortkeyConfig.currChainId(),
            });
        if (!guardianResult) {
          throw new Error('network failure');
        }
        Loading.hide();
        dealWithSetPin({
          normalVerifyPathInfo: {
            fromRecovery: false,
            accountIdentifier,
            chainId: await PortkeyConfig.currChainId(),
            extraData: DefaultExtraData,
            verifiedGuardians: [
              {
                type: guardianTypeStrToEnum(google ? 'Google' : 'Apple'),
                identifier: accountIdentifier,
                verifierId: id,
                verificationDoc: guardianResult.verificationDoc,
                signature: guardianResult.signature,
              },
            ],
          },
        });
      } else {
        const pageData = await getRegisterPageData(accountIdentifier, accountOriginalType, navigateToGuardianPage);
        if (!pageData.guardianConfig) {
          throw new Error('network failure');
        }
        Loading.hide();
        ActionSheet.alert({
          title: '',
          message: `${
            pageData.guardianConfig?.name ?? 'Portkey'
          } will send a verification code to ${accountIdentifier} to verify your ${
            accountOriginalType === AccountOriginalType.Email ? 'email' : 'phone number'
          }.`,
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
      }
    } catch (e) {
      setErrorMessage(handleErrorMessage(e));
      Loading.hide();
    }
  };

  return {
    verifyEntry,
    thirdPartyLogin,
  };
};

export interface VerifyEntryHooks {
  verifyEntry: (accountIdentifier: string) => void;
  thirdPartyLogin: (thirdPartyLoginType: 'google' | 'apple') => Promise<void>;
}

export interface VerifyConfig {
  type: PageType;
  entryName: PortkeyEntries;
  accountOriginalType: AccountOriginalType;
  setErrorMessage: (context: any) => void;
  verifyAccountIdentifier?: (account: string, thirdPartyAccountInfo?: ThirdPartyAccountInfo) => string | void;
  appleSign?: () => Promise<AppleAccountInfo>;
  googleSign?: () => Promise<GoogleAccountInfo>;
}

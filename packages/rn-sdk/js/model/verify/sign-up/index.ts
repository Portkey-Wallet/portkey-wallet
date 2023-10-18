import { GuardianConfig } from '../guardian';
import { AccountOriginalType, VerifiedGuardianDoc } from '../after-verify';
import { NetworkController } from 'network/controller';
import { OperationTypeEnum } from '@portkey-wallet/types/verifier';
import { SendVerifyCodeResultDTO } from 'network/dto/guardian';

const useSignUp = (config: Omit<SignUpConfig, 'guardianConfig'>): SignUpHooks => {
  const isGoogleRecaptchaOpen = async () => {
    return await NetworkController.isGoogleRecaptchaOpen(OperationTypeEnum.register);
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

  const handleGuardianVerifyPage = async (
    guardianConfig: GuardianConfig,
    alreadySent?: boolean,
  ): Promise<VerifiedGuardianDoc | null> => {
    if (!guardianConfig) {
      console.error('guardianConfig is not defined.');
      return null;
    }
    return new Promise(resolve => {
      config.navigateToGuardianPage(
        Object.assign({}, guardianConfig, { alreadySent: alreadySent ?? false }),
        result => {
          if (result) {
            resolve(result);
          } else {
            resolve(null);
          }
        },
      );
    });
  };

  return {
    isGoogleRecaptchaOpen,
    sendVerifyCode,
    handleGuardianVerifyPage,
  };
};

export interface SignUpHooks {
  isGoogleRecaptchaOpen: () => Promise<boolean>;
  sendVerifyCode: (
    guardianConfig: GuardianConfig | undefined,
    googleRecaptchaToken?: string,
  ) => Promise<SendVerifyCodeResultDTO | null>;
  handleGuardianVerifyPage: (
    guardianConfig: GuardianConfig,
    alreadySent?: boolean,
  ) => Promise<VerifiedGuardianDoc | null>;
}

export interface SignUpConfig {
  accountIdentifier: string;
  accountOriginalType: AccountOriginalType;
  guardianConfig?: GuardianConfig;
  navigateToGuardianPage: (guardianConfig: GuardianConfig, callback: (data: VerifiedGuardianDoc) => void) => void;
}

export default useSignUp;

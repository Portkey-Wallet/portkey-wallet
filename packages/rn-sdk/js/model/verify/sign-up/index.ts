import { useCallback, useState } from 'react';
import { GuardianConfig } from '../guardian';
import { AccountOriginalType, AfterVerifiedConfig, VerifiedGuardianDoc } from '../after-verify';
import { DeviceType } from '@portkey-wallet/types/types-ca/device';
import { NetworkController } from 'network/controller';
import { OperationTypeEnum } from '@portkey-wallet/types/verifier';

const useSignUp = (config: SignUpConfig) => {
  const [verifiedGuardianInfo, setVerifiedGuardianInfo] = useState<VerifiedGuardianDoc | null>(null);
  const isVerified = useCallback(() => !!verifiedGuardianInfo, [verifiedGuardianInfo]);
  const getVerifiedData = useCallback(() => {
    if (!isVerified()) throw new Error('not verified');
    return {
      accountOriginalType: config.accountOriginalType,
      fromRecovery: false,
      accountIdentifier: config.accountIdentifier,
      verifiedGuardians: [verifiedGuardianInfo],
      chainId: config.guardianConfig.sendVerifyCodeParams.chainId,
      extraData: { deviceName: 'Other', deviceType: DeviceType.OTHER },
    } as Partial<AfterVerifiedConfig>;
  }, [config, isVerified, verifiedGuardianInfo]);

  const sendVerifyCode = useCallback(
    async (googleRecaptchaToken?: string): Promise<boolean> => {
      const needGoogleRecaptcha = await NetworkController.isGoogleRecaptchaOpen(
        config.guardianConfig.sendVerifyCodeParams.operationType,
      );
      if (needGoogleRecaptcha && !googleRecaptchaToken) {
        console.warn('Need google recaptcha! Better check it before calling this function.');
        return false;
      }
      const result = await NetworkController.sendVerifyCode(
        config.guardianConfig.sendVerifyCodeParams,
        googleRecaptchaToken ? { reCaptchaToken: googleRecaptchaToken } : {},
      );
      if (result.verifierSessionId) {
        return true;
      } else {
        return false;
      }
    },
    [config],
  );

  const isGoogleRecaptchaOpen = async () => {
    return await NetworkController.isGoogleRecaptchaOpen(OperationTypeEnum.register);
  };

  const goToGuardianVerifyPage = useCallback(() => {
    config.navigateToGuardianPage(setVerifiedGuardianInfo);
  }, [config]);

  return {
    isVerified,
    getVerifiedData,
    isGoogleRecaptchaOpen,
    sendVerifyCode,
    goToGuardianVerifyPage,
  };
};

export interface SignUpConfig {
  accountIdentifier: string;
  accountOriginalType: AccountOriginalType;
  guardianConfig: GuardianConfig;
  isGoogleRecaptchaOpen: () => Promise<boolean>;
  sendVerifyCode: (googleRecaptchaToken?: string) => Promise<boolean>;
  navigateToGuardianPage: (callback: (data: VerifiedGuardianDoc) => void) => void;
}

export default useSignUp;

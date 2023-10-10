import { useCallback, useState } from 'react';
import { GuardianConfig } from '../guardian';
import { AccountOriginalType, AfterVerifiedConfig, VerifiedGuardianDoc } from '../after-verify';
import { DeviceType } from '@portkey-wallet/types/types-ca/device';
import { NetworkController } from 'network/controller';
import { OperationTypeEnum } from '@portkey-wallet/types/verifier';
import { EntryResult } from 'service/native-modules';
import { SendVerifyCodeResultDTO } from 'network/dto/guardian';

const useSignUp = (config: SignUpConfig): SignUpHooks => {
  const [verifiedGuardianInfo, setVerifiedGuardianInfo] = useState<VerifiedGuardianDoc | null>(null);
  const isVerified = useCallback(() => !!verifiedGuardianInfo, [verifiedGuardianInfo]);
  const getVerifiedData = useCallback(() => {
    if (!isVerified()) throw new Error('not verified');
    if (!config.guardianConfig) throw new Error('guardianConfig is not defined');
    return {
      accountOriginalType: config.accountOriginalType,
      fromRecovery: false,
      accountIdentifier: config.accountIdentifier,
      verifiedGuardians: [verifiedGuardianInfo],
      chainId: config.guardianConfig.sendVerifyCodeParams.chainId,
      extraData: { deviceName: 'Other', deviceType: DeviceType.OTHER },
    } as Partial<AfterVerifiedConfig>;
  }, [config, isVerified, verifiedGuardianInfo]);

  const sendVerifyCode = async (
    guardianConfig: GuardianConfig | undefined,
    googleRecaptchaToken?: string,
  ): Promise<SendVerifyCodeResultDTO | null> => {
    const guardian = guardianConfig ?? config.guardianConfig;
    if (!guardian) throw new Error('guardianConfig is not defined');
    const needGoogleRecaptcha = await NetworkController.isGoogleRecaptchaOpen(
      guardian.sendVerifyCodeParams.operationType,
    );
    if (needGoogleRecaptcha && !googleRecaptchaToken) {
      console.warn('Need google recaptcha! Better check it before calling this function.');
      return null;
    }
    const result = await NetworkController.sendVerifyCode(
      guardian.sendVerifyCodeParams,
      googleRecaptchaToken ? { reCaptchaToken: googleRecaptchaToken } : {},
    );
    if (result?.verifierSessionId) {
      return result;
    } else {
      return null;
    }
  };

  const isGoogleRecaptchaOpen = async () => {
    return await NetworkController.isGoogleRecaptchaOpen(OperationTypeEnum.register);
  };

  const handleGuardianVerifyPage = useCallback(
    async (guardianConfig?: GuardianConfig, alreadySent?: boolean): Promise<boolean> => {
      const guardian = guardianConfig ?? config.guardianConfig;
      if (!guardian) {
        console.error('guardianConfig is not defined.');
        return false;
      }
      return new Promise(resolve => {
        config.navigateToGuardianPage(Object.assign({}, guardian, { alreadySent: alreadySent ?? false }), result => {
          console.error('config.navigateToGuardianPage', result);
          if (result && result.data) {
            setVerifiedGuardianInfo(result.data);
            resolve(true);
          } else {
            resolve(false);
          }
        });
      });
    },
    [config],
  );

  return {
    isVerified,
    getVerifiedData,
    isGoogleRecaptchaOpen,
    sendVerifyCode,
    handleGuardianVerifyPage,
  };
};

export interface SignUpHooks {
  isVerified: () => boolean;
  getVerifiedData: () => Partial<AfterVerifiedConfig>;
  isGoogleRecaptchaOpen: () => Promise<boolean>;
  sendVerifyCode: (
    guardianConfig: GuardianConfig | undefined,
    googleRecaptchaToken?: string,
  ) => Promise<SendVerifyCodeResultDTO | null>;
  handleGuardianVerifyPage: (guardianConfig?: GuardianConfig, alreadySent?: boolean) => Promise<boolean>;
}

export interface SignUpConfig {
  accountIdentifier: string;
  accountOriginalType: AccountOriginalType;
  guardianConfig?: GuardianConfig;
  navigateToGuardianPage: (
    guardianConfig: GuardianConfig,
    callback: (data: EntryResult<VerifiedGuardianDoc>) => void,
  ) => void;
}

export default useSignUp;

import { useCallback } from 'react';
import usePhoneOrEmailGuardian, { GuardianConfig, GuardianStatus } from '../guardian';
import { AfterVerifiedConfig } from '../after-verify';
import { DeviceType } from '@portkey-wallet/types/types-ca/device';

const useSignUp = (config: SignUpConfig) => {
  const { status, sendVerifyCode, checkVerifyCode, getVerifiedGuardianDoc } = usePhoneOrEmailGuardian(
    config.guardianConfig,
  );
  const isVerified = useCallback(() => status === GuardianStatus.VERIFIED, [status]);
  const getVerifiedData = useCallback(() => {
    if (!isVerified()) throw new Error('not verified');
    return {
      fromRecovery: false,
      accountIdentifier: config.accountIdentifier,
      verifiedGuardians: [getVerifiedGuardianDoc()],
      chainId: config.guardianConfig.sendVerifyCodeParams.chainId,
      extraData: { deviceName: 'Other', deviceType: DeviceType.OTHER },
    } as Partial<AfterVerifiedConfig>;
  }, [config, getVerifiedGuardianDoc, isVerified]);

  return {
    status,
    isVerified,
    sendVerifyCode,
    checkVerifyCode,
    getVerifiedData,
  };
};

export interface SignUpConfig {
  accountIdentifier: string;
  guardianConfig: GuardianConfig;
}

export default useSignUp;

import { useCallback, useState } from 'react';
import { GuardianConfig } from '../guardian';
import { AccountOriginalType, AfterVerifiedConfig, VerifiedGuardianDoc } from '../after-verify';
import { DeviceType } from '@portkey-wallet/types/types-ca/device';

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

  return {
    status,
    isVerified,
    setVerifiedGuardianInfo,
    getVerifiedData,
  };
};

export interface SignUpConfig {
  accountIdentifier: string;
  accountOriginalType: AccountOriginalType;
  guardianConfig: GuardianConfig;
}

export default useSignUp;

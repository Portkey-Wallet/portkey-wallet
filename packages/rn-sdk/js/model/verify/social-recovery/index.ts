import { useCallback, useEffect, useState } from 'react';
import { AccountOriginalType, AfterVerifiedConfig, VerifiedGuardianDoc } from '../after-verify';
import { GuardianConfig } from '../guardian';
import { CheckVerifyCodeResultDTO } from 'network/dto/guardian';
import { PortkeyConfig } from 'global';
import { DeviceType } from '@portkey-wallet/types/types-ca/device';

const useSocialRecovery = (config: SocialRecoveryConfig): SocialRecoveryEntity => {
  /**
   * the guardian's verify rule:
   * <p>
   * if length <= 3: verifyLimit = length
   * <p>
   * if length > 3: verifyLimit = Math.floor(guardians.size() * 0.6) + 1
   */
  const getVerifyLimit = useCallback(() => {
    const length = config.guardians.length;
    if (length <= 3) return length;
    return Math.floor(config.guardians.length * 0.6 + 1);
  }, [config.guardians]);

  const [verifiedGuardianInfo, setVerifiedGuardianInfo] = useState<Map<string, VerifiedGuardianInfo>>(new Map());

  const informTargetGuardianVerified = useCallback(
    (verifierId: string, info: VerifiedGuardianInfo) => {
      const target = config.guardians.find(guardian => guardian.sendVerifyCodeParams.verifierId === verifierId);
      if (!target) {
        console.error('can not find target guardian');
        return;
      }
      setVerifiedGuardianInfo(prev => {
        const newMap = new Map(prev);
        newMap.set(verifierId, info);
        return newMap;
      });
    },
    [config.guardians],
  );

  useEffect(() => {
    console.error('guardian info changed, it is not allowed to change guardian info after init');
  }, [config.guardians]);

  const getParticularGuardianInfo = useCallback(
    (index: number) => {
      return config.guardians[index];
    },
    [config.guardians],
  );

  const hasReachedVerifyLimit = useCallback(() => {
    return verifiedGuardianInfo.size >= getVerifyLimit();
  }, [verifiedGuardianInfo, getVerifyLimit]);

  const getVerifiedData = useCallback(() => {
    if (!hasReachedVerifyLimit()) throw new Error('not verified');
    return {
      accountIdentifier: config.accountIdentifier,
      accountOriginalType: config.accountOriginalType,
      verifiedGuardians: config.guardians
        .map(guardian => {
          const verifiedInfo = verifiedGuardianInfo.get(guardian.sendVerifyCodeParams.verifierId);
          if (!verifiedInfo) return null;
          return {
            ...guardian,
            identifier: config.accountIdentifier,
            ...verifiedInfo,
            verifierId: guardian.sendVerifyCodeParams.verifierId,
            type: config.accountOriginalType,
          } as VerifiedGuardianDoc;
        })
        .filter(it => it !== null) as Array<VerifiedGuardianDoc>,
      extraData: { deviceName: 'Other', deviceType: DeviceType.OTHER },
      fromRecovery: true,
      chainId: PortkeyConfig.currChainId,
    } as Partial<AfterVerifiedConfig>;
  }, [config, verifiedGuardianInfo, hasReachedVerifyLimit]);

  return {
    getVerifyLimit,
    verifiedGuardianInfo,
    informTargetGuardianVerified,
    getParticularGuardianInfo,
    hasReachedVerifyLimit,
    getVerifiedData,
  };
};

export interface SocialRecoveryConfig {
  accountIdentifier: string;
  accountOriginalType: AccountOriginalType;
  guardians: Array<GuardianConfig>;
}

export interface SocialRecoveryEntity {
  getVerifyLimit: () => number;
  verifiedGuardianInfo: Map<string, VerifiedGuardianInfo>;
  informTargetGuardianVerified: (verifierId: string, info: VerifiedGuardianInfo) => void;
  getParticularGuardianInfo: (index: number) => GuardianConfig;
  hasReachedVerifyLimit: () => boolean;
  getVerifiedData: () => Partial<AfterVerifiedConfig>;
}

export type VerifiedGuardianInfo = CheckVerifyCodeResultDTO;

export default useSocialRecovery;

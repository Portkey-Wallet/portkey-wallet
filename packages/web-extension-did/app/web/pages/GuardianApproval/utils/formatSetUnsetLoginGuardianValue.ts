import { UserGuardianItem, UserGuardianStatus } from '@portkey-wallet/store/store-ca/guardians/type';
import { GuardianItem } from 'types/guardians';

export const formatSetUnsetGuardianValue = ({
  userGuardianStatus,
  opGuardian,
}: {
  userGuardianStatus?: {
    [x: string]: UserGuardianStatus;
  };
  opGuardian?: UserGuardianItem;
}) => {
  let guardian = {};
  let guardianSet: GuardianItem = {} as GuardianItem;
  const guardiansApproved: GuardianItem[] = [];
  Object.values(userGuardianStatus ?? {})?.forEach((item: UserGuardianStatus) => {
    if (item.key === opGuardian?.key) {
      guardian = {
        type: item.guardianType,
        identifierHash: item.identifierHash,
        verifierId: item.verifier?.id,
        salt: item.salt,
        isLoginGuardian: item.isLoginAccount,
      };
      guardianSet = {
        type: item.guardianType,
        identifierHash: item.identifierHash,
        verificationInfo: {
          id: item.verifier?.id as string,
          signature: Object.values(Buffer.from(item.signature as any, 'hex')),
          verificationDoc: item.verificationDoc as string,
        },
      };
    } else if (item.signature) {
      guardiansApproved.push({
        type: item.guardianType,
        identifierHash: item.identifierHash,
        verificationInfo: {
          id: item.verifier?.id as string,
          signature: Object.values(Buffer.from(item.signature as any, 'hex')),
          verificationDoc: item.verificationDoc as string,
        },
      });
    }
  });

  return {
    [opGuardian?.isLoginAccount ? 'guardianToUnsetLogin' : 'guardianToSetLogin']: guardianSet,
    guardiansApproved,
    guardian,
  };
};

import { UserGuardianItem, UserGuardianStatus } from '@portkey-wallet/store/store-ca/guardians/type';
import { GuardianItem } from 'types/guardians';

export const formatAddGuardianValue = ({
  userGuardianStatus,
  opGuardian,
}: {
  userGuardianStatus?: {
    [x: string]: UserGuardianStatus;
  };
  opGuardian?: UserGuardianItem;
}) => {
  let guardianToAdd: GuardianItem = {} as GuardianItem;
  const guardiansApproved: GuardianItem[] = [];
  Object.values(userGuardianStatus ?? {})?.forEach((item: UserGuardianStatus) => {
    if (item.key === opGuardian?.key) {
      guardianToAdd = {
        type: item.guardianType,
        identifierHash: item.identifierHash,
        verificationInfo: {
          id: item.verifier?.id as string,
          signature: Object.values(Buffer.from(item.signature as any, 'hex')),
          verificationDoc: item.verificationDoc || '',
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
  return { guardianToAdd, guardiansApproved };
};

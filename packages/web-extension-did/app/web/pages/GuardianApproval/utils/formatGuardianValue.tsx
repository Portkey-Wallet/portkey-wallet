import { UserGuardianStatus } from '@portkey-wallet/store/store-ca/guardians/type';
import { GuardianItem } from 'types/guardians';

export const formatGuardianValue = (userGuardianStatus?: { [x: string]: UserGuardianStatus }) => {
  const guardiansApproved: GuardianItem[] = [];
  Object.values(userGuardianStatus ?? {})?.forEach((item: UserGuardianStatus) => {
    if (item.signature) {
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
  return { guardiansApproved };
};

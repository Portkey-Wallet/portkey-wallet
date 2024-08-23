import { UserGuardianItem, UserGuardianStatus } from '@portkey-wallet/store/store-ca/guardians/type';
import { LoginType } from '@portkey-wallet/types/types-ca/wallet';
import { GuardianItem } from 'types/guardians';
import { formatVerifyInfo } from './formatVerifyInfo';

export const formatDelGuardianValue = ({
  userGuardianStatus,
  opGuardian,
}: {
  userGuardianStatus?: {
    [x: string]: UserGuardianStatus;
  };
  opGuardian?: UserGuardianItem;

  preGuardian?: UserGuardianItem;
}) => {
  const guardianToRemove: GuardianItem = {
    type: opGuardian?.guardianType as LoginType,
    identifierHash: opGuardian?.identifierHash,
    verificationInfo: {
      id: opGuardian?.verifier?.id as string,
    },
  };
  const guardiansApproved: GuardianItem[] = [];
  Object.values(userGuardianStatus ?? {})?.forEach((item: UserGuardianStatus) => {
    if (item.signature || item.zkLoginInfo) {
      guardiansApproved.push(formatVerifyInfo(item));
    }
  });
  return { guardianToRemove, guardiansApproved };
};

import { UserGuardianItem, UserGuardianStatus } from '@portkey-wallet/store/store-ca/guardians/type';
import { LoginType, isZKLoginSupported } from '@portkey-wallet/types/types-ca/wallet';
import { GuardianItem } from 'types/guardians';
import { formatVerifyInfo } from './formatVerifyInfo';

export const formatEditGuardianValue = ({
  userGuardianStatus,
  opGuardian,
  preGuardian,
}: {
  userGuardianStatus?: {
    [x: string]: UserGuardianStatus;
  };
  opGuardian?: UserGuardianItem;

  preGuardian?: UserGuardianItem;
}) => {
  const isZkLoginType = isZKLoginSupported(preGuardian?.guardianType ?? 0);
  const guardianToUpdatePre: GuardianItem = {
    identifierHash: preGuardian?.identifierHash,
    type: preGuardian?.guardianType as LoginType,
    verificationInfo: {
      id: preGuardian?.verifier?.id as string,
    },
    updateSupportZk: false,
  };
  const guardianToUpdateNew: GuardianItem = {
    identifierHash: preGuardian?.identifierHash,
    type: opGuardian?.guardianType as LoginType,
    verificationInfo: {
      id: opGuardian?.verifier?.id as string,
    },
    updateSupportZk: isZkLoginType,
  };
  const guardiansApproved: GuardianItem[] = [];
  Object.values(userGuardianStatus ?? {})?.forEach((item: UserGuardianStatus) => {
    if (item.signature || item.zkLoginInfo) {
      guardiansApproved.push(formatVerifyInfo(item));
    }
  });
  return { guardianToUpdatePre, guardianToUpdateNew, guardiansApproved };
};

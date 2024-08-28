import { UserGuardianItem, UserGuardianStatus } from '@portkey-wallet/store/store-ca/guardians/type';
import { GuardianItem } from 'types/guardians';
import { formatVerifyInfo } from './formatVerifyInfo';

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
      guardianSet = formatVerifyInfo(item);
    } else if (item.signature || item.zkLoginInfo) {
      guardiansApproved.push(formatVerifyInfo(item));
    }
  });

  return {
    [opGuardian?.isLoginAccount ? 'guardianToUnsetLogin' : 'guardianToSetLogin']: guardianSet,
    guardiansApproved,
    guardian,
  };
};

import { UserGuardianItem, UserGuardianStatus } from '@portkey-wallet/store/store-ca/guardians/type';
import { ISocialLogin, LoginType } from '@portkey-wallet/types/types-ca/wallet';
import { handleZKLoginInfo } from '@portkey-wallet/utils/guardian';
import { zkloginGuardianType } from 'constants/guardians';
import { GuardianItem } from 'types/guardians';
import { formatVerifyInfo } from './formatVerifyInfo';

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
      if (zkloginGuardianType.includes(LoginType[opGuardian.guardianType] as ISocialLogin)) {
        guardianToAdd = {
          type: item.guardianType,
          identifierHash: item.zkLoginInfo?.identifierHash,
          verificationInfo: {
            id: item.verifier?.id as string,
          },
          zkLoginInfo: handleZKLoginInfo(item?.zkLoginInfo),
        };
      } else {
        guardianToAdd = formatVerifyInfo(item);
      }
    } else if (item.signature || item.zkLoginInfo) {
      guardiansApproved.push(formatVerifyInfo(item));
    }
  });
  return { guardianToAdd, guardiansApproved };
};

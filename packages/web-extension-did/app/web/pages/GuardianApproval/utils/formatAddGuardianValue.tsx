import { UserGuardianItem, UserGuardianStatus } from '@portkey-wallet/store/store-ca/guardians/type';
import { isZKLoginSupported } from '@portkey-wallet/types/types-ca/wallet';
import { handleZKLoginInfo } from '@portkey-wallet/utils/guardian';
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
      if (isZKLoginSupported(opGuardian.guardianType)) {
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

import { UserGuardianStatus } from '@portkey-wallet/store/store-ca/guardians/type';
import { GuardianItem } from 'types/guardians';
import { formatVerifyInfo } from './formatVerifyInfo';

export const formatGuardianValue = (userGuardianStatus?: { [x: string]: UserGuardianStatus }) => {
  const guardiansApproved: GuardianItem[] = [];
  Object.values(userGuardianStatus ?? {})?.forEach((item: UserGuardianStatus) => {
    if (item.signature || item.zkLoginInfo) {
      guardiansApproved.push(formatVerifyInfo(item));
    }
  });
  return { guardiansApproved };
};

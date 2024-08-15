import { UserGuardianStatus } from '@portkey-wallet/store/store-ca/guardians/type';
import { ISocialLogin, LoginType } from '@portkey-wallet/types/types-ca/wallet';
import { handleZKLoginInfo } from '@portkey-wallet/utils/guardian';
import { zkloginGuardianType } from 'constants/guardians';

export const formatVerifyInfo = (item: UserGuardianStatus) => {
  if (zkloginGuardianType.includes(LoginType[item.guardianType] as ISocialLogin)) {
    return {
      type: item.guardianType,
      identifierHash: item.identifierHash,
      verificationInfo: {
        id: item.verifier?.id as string,
      },
      zkLoginInfo: handleZKLoginInfo(item?.zkLoginInfo),
    };
  } else {
    return {
      type: item.guardianType,
      identifierHash: item.identifierHash,
      verificationInfo: {
        id: item.verifier?.id as string,
        signature: Object.values(Buffer.from(item.signature as any, 'hex')),
        verificationDoc: item.verificationDoc as string,
      },
    };
  }
};

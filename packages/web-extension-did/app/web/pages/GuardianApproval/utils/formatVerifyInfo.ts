import { UserGuardianStatus } from '@portkey-wallet/store/store-ca/guardians/type';
import { isZKLoginSupported } from '@portkey-wallet/types/types-ca/wallet';
import { handleZKLoginInfo } from '@portkey-wallet/utils/guardian';

export const formatVerifyInfo = (item: UserGuardianStatus) => {
  if (isZKLoginSupported(item.guardianType)) {
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

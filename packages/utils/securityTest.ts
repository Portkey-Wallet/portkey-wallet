import { request } from '@portkey-wallet/api/api-did';

type CheckSecurityResult = {
  isTransferSafe: boolean;
  isSynchronizing: boolean;
  isOriginChainSafe: boolean;
};

export const checkSecurity = async (caHash: string): Promise<CheckSecurityResult> => {
  return await request.privacy.securityCheck({
    params: {
      caHash,
    },
  });
};

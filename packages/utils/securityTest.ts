import { request } from '@portkey-wallet/api/api-did';

export const checkSecurity = async (caHash: string) => {
  const { isSafe } = await request.privacy.securityCheck({
    params: {
      caHash,
    },
  });

  return isSafe;
};

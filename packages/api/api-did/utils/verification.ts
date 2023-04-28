import { LoginKeyType } from '@portkey-wallet/types/types-ca/wallet';
import { request } from '..';

interface CheckVerificationCodeProps {
  type: LoginKeyType;
  baseUrl?: string;
  verifierId: string;
  chainId: string | number;
  guardianIdentifier: string;
  verifierSessionId: string;
  verificationCode: string;
}

interface ErrorBack {
  code: null | any;
  message?: string;
}

export async function checkVerificationCode({
  type,
  baseUrl,
  chainId,
  verifierId,
  guardianIdentifier,
  verificationCode,
  verifierSessionId,
}: CheckVerificationCodeProps): Promise<{
  verificationDoc: string;
  signature: string;
  error?: ErrorBack;
}> {
  return await request.verify.checkVerificationCode({
    baseURL: baseUrl,
    params: {
      type,
      verifierId,
      verifierSessionId,
      verificationCode,
      guardianIdentifier,
      chainId,
    },
  });
}

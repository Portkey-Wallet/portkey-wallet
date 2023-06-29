import { ChainId } from '@portkey-wallet/types';
import { VerifierCodeOperationType } from '../verifier';

export type VerifyTokenParams = {
  accessToken?: string;
  verifierId?: string;
  chainId: ChainId;
  id: string;
  verifierCodeOperation: VerifierCodeOperationType;
};

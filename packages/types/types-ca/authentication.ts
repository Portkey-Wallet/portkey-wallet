import { ChainId } from '@portkey-wallet/types';
import { OperationTypeEnum } from '../verifier';

export type VerifyTokenParams = {
  accessToken?: string;
  verifierId?: string;
  chainId: ChainId;
  id: string;
  operationType: OperationTypeEnum;
  targetChainId?: ChainId;
  operationDetails?: string;
  verificationDetails?: {
    address: string;
    publicKey: string;
    signature: string;
    timestamp: string;
    extra?: string;
  };
};

export type ReportUnsetLoginGuardianProps = {
  chainId: ChainId;
  caHash: string;
  unsetGuardianIdentifierHash: string;
};

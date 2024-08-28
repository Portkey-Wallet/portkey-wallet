import { ChainId } from '@portkey-wallet/types';
import { OperationTypeEnum } from '../verifier';

export type VerifyTokenParams = {
  accessToken?: string;
  idToken?: string;
  nonce?: string;
  timestamp?: number;
  salt?: string;
  verifierId?: string;
  chainId: ChainId;
  id: string;
  operationType: OperationTypeEnum;
  targetChainId?: ChainId;
  caHash?: string;
  operationDetails?: string;
};

export type VerifyZKPortkeyParams = {
  type: string;
  accessToken?: string;
  jwt?: string;
  verifierId?: string;
  chainId: ChainId;
  operationType: OperationTypeEnum;
  caHash?: string;
  operationDetails?: string;
};

export type VerifyZKLoginParams = {
  verifyToken: VerifyZKPortkeyParams;
  jwt?: string;
  salt: string;
  kid: string;
  nonce?: string;
  timestamp: number;
  managerAddress: string;
};

export type ReportUnsetLoginGuardianProps = {
  chainId: ChainId;
  caHash: string;
  unsetGuardianIdentifierHash: string;
};

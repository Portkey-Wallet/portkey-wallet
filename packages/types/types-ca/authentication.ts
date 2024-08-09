import { ChainId } from '@portkey-wallet/types';
import { OperationTypeEnum } from '../verifier';

export type VerifyTokenParams = {
  accessToken?: string;
  idToken?: string;
  nonce?: string;
  salt?: string;
  verifierId?: string;
  chainId: ChainId;
  id: string;
  operationType: OperationTypeEnum;
  targetChainId?: ChainId;
  operationDetails?: string;
};

export type VerifyZKPortkeyParams = {
  type: string;
  accessToken?: string;
  jwt?: string;
  verifierId?: string;
  chainId: ChainId;
  operationType: OperationTypeEnum;
};

export type VerifyZKLoginParams = {
  verifyToken: VerifyZKPortkeyParams;
  jwt?: string;
  salt: string;
  kid: string;
  nonce?: string;
};

export type ReportUnsetLoginGuardianProps = {
  chainId: ChainId;
  caHash: string;
  unsetGuardianIdentifierHash: string;
};

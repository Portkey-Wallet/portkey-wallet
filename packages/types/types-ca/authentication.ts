import { ChainId } from '@portkey-wallet/types';
import { OperationTypeEnum } from '../verifier';

export type VerifyTokenParams = {
  accessToken?: string;
  idToken?: string;
  verifierId?: string;
  chainId: ChainId;
  id: string;
  operationType: OperationTypeEnum;
  targetChainId?: ChainId;
  operationDetails?: string;
};

export type VerifyZKLoginParams = {
  jwt?: string;
  salt: string;
  kid: string;
};

export type ReportUnsetLoginGuardianProps = {
  chainId: ChainId;
  caHash: string;
  unsetGuardianIdentifierHash: string;
};

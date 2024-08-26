import { ChainId } from '@portkey-wallet/types';
import { OperationTypeEnum } from '../verifier';

export type VerifyTokenParams = {
  accessToken?: string;
  verifierId?: string;
  chainId: ChainId;
  id: string;
  operationType: OperationTypeEnum;
  targetChainId?: ChainId;
  caHash?: string;
  operationDetails?: string;
};

export type ReportUnsetLoginGuardianProps = {
  chainId: ChainId;
  caHash: string;
  unsetGuardianIdentifierHash: string;
};

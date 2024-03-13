import { IAccelerateGuardian } from '@portkey/services';

export interface CheckTransactionFeeParams {
  chainIds: string[];
}

export type CheckTransactionFeeResult = { chainId: string; transactionFee: TransactionFeeItem }[];

export interface TransactionFeeItem {
  ach: string;
  crossChain: string;
  max: string;
  redPackage: string;
}

export interface CheckTransferSecurityParams {
  caHash: string;
  targetChainId: string;
}

export type CheckSecurityResult = {
  isTransferSafe: boolean;
  isSynchronizing: boolean;
  isOriginChainSafe: boolean;
  accelerateGuardians: IAccelerateGuardian[];
};

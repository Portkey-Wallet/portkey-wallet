import { TransactionTypes } from 'packages/constants/constants-ca/activity';
import { ChainId, ChainType } from '..';
import { BaseToken } from './token';

export type ActivityItemType = {
  chainId: string;
  transactionType: TransactionTypes;
  transactionName?: string; // item title
  from: string; // wallet name
  to: string; // to user nick name
  fromAddress: string;
  toAddress: string;
  fromChainId: ChainId;
  toChainId: ChainId;
  status: string;
  transactionId: string;
  blockHash: string; // The chain may have forks, use transactionId and blockHash to uniquely determine the transaction
  timestamp: string;
  isReceived: boolean; // Is it a received transaction
  amount: string;
  symbol: string;
  decimals?: string;
  priceInUsd?: string;
  nftInfo?: NftInfo;
  transactionFees: TransactionFees[];
  listIcon?: string;
  isDelegated?: boolean;
};

export type NftInfo = {
  imageUrl: string;
  alias: string;
  nftId: string;
};

export type TransactionFees = {
  symbol: string;
  fee: number;
  feeInUsd: string;
  decimals: string;
};

export type the2ThFailedActivityItemType = {
  transactionId: string;
  params: {
    chainType: ChainType;
    managerAddress: string;
    tokenInfo: BaseToken;
    amount: number;
    toAddress: string;
    memo?: string;
    issueChainId: number;
  };
};

export enum TransactionStatus {
  Conflict = 'CONFLICT',
  Failed = 'FAILED',
  Mined = 'MINED',
  NodeValidationFailed = 'NODE_VALIDATION_FAILED',
  NotExisted = 'NOT_EXISTED',
  Pending = 'PENDING',
  PendingValidation = 'PENDING_VALIDATION',
}

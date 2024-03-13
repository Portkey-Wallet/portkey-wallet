import type { ec } from 'elliptic';
export declare type AElfAddress = string;
export declare type AElfBlockHeight = number;
export declare type AElfChainId = string;
export declare type PublicKey = {
  x: string;
  y: string;
};
export declare type AElfWallet = {
  address: string;
  privateKey?: string;
  childWallet?: string;
  BIP44Path?: string;
  keyPair?: ec.KeyPair;
};
export declare type Block = {
  BlockHash: string;
  Header: any;
  Body: any;
  BlockSize: number;
};
export declare type AElfSDKError = {
  code: number;
  error: any;
  mag: string;
};
export declare type ChainStatus = {
  BestChainHash: string;
  BestChainHeight: AElfBlockHeight;
  Branches: {
    [key: string]: number;
  };
  ChainId: AElfChainId;
  GenesisBlockHash: string;
  GenesisContractAddress: string;
  LastIrreversibleBlockHash: string;
  LastIrreversibleBlockHeight: number;
  LongestChainHash: string;
  LongestChainHeight: number;
  NotLinkedBlocks: any;
};
export declare type AElfTransaction = {
  From: string;
  To: string;
  RefBlockNumber: AElfBlockHeight;
  RefBlockPrefix: string;
  Params: string;
  Signature: string;
  MethodName: string;
};
export declare type TransactionStatus =
  | 'MINED'
  | 'PENDING'
  | 'NOT_EXISTED'
  | 'FAILED'
  | 'CONFLICT'
  | 'PENDING_VALIDATION'
  | 'NODE_VALIDATION_FAILED';

export declare type TransactionResult = {
  BlockHash: string;
  BlockNumber: AElfBlockHeight;
  Bloom: string;
  Error: null | any;
  Logs: any;
  ReturnValue: any;
  Status: TransactionStatus;
  Transaction: AElfTransaction;
  TransactionId: string;
  TransactionSize: number;
};
export declare type ChainMethodResult<T> = T & AElfSDKError;

export interface CalculateTransactionFeeOutput {
  Success: boolean;
  TransactionFee: any;
  ResourceFee: any;
}
export declare interface AElfChainMethods {
  /**
   * Get contract instance
   * It is different from the wallet created by Aelf.wallet.getWalletByPrivateKey();
   * There is only one value named address;
   */
  contractAt(address: string, wallet: AElfWallet): Promise<ChainMethodResult<any>>;
  /**
   * Get block information by block hash.
   */
  getBlock(blockHash: string, includeTransactions?: boolean): Promise<ChainMethodResult<Block>>;
  /**
   * Get block information by block height.
   */
  getBlockByHeight(blockHeight: number, includeTransactions?: boolean): Promise<ChainMethodResult<Block>>;
  /**
   * Get current best height of the chain.
   */
  getBlockHeight(): Promise<ChainMethodResult<number>>;
  /**
   * Get chain state
   */
  getChainState(...args: unknown[]): Promise<ChainMethodResult<any>>;
  /**
   * Get chain status
   */
  getChainStatus(...args: unknown[]): Promise<ChainMethodResult<ChainStatus>>;
  /**
   * Get the protobuf definitions related to a contract
   */
  getContractFileDescriptorSet(contractAddress: string): Promise<ChainMethodResult<string>>;
  /**
   * Get the transaction pool status.
   */
  getTransactionPoolStatus(): Promise<ChainMethodResult<any>>;
  /**
   * Get the result of a transaction
   */
  getTxResult(transactionId: string): Promise<ChainMethodResult<TransactionResult>>;
  /**
   * Get multiple transaction results in a block
   */
  getTxResults(blockHash: string, offset?: number, limit?: number): Promise<ChainMethodResult<TransactionResult[]>>;
  /**
   * Broadcast a transaction
   */
  sendTransaction(...args: unknown[]): Promise<ChainMethodResult<any>>;
  /**
   * Broadcast a transactions
   */
  sendTransactions(...args: unknown[]): Promise<ChainMethodResult<any>>;
  /**
   *
   */
  calculateTransactionFee(RawTransaction: string): Promise<ChainMethodResult<CalculateTransactionFeeOutput>>;
}

export declare type CurrentProvider = {
  host: string;
  timeout: number;
};

export declare type Version = {
  api: string;
};

export declare type AElfInterface = {
  chain: AElfChainMethods;
  currentProvider: CurrentProvider;
  version: Version;
};

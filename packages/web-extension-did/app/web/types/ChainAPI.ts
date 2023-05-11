export type CommonFunType = (...args: any[]) => any;
export type GetChainStatusFun = (callback?: CommonFunType) => Promise<any> | undefined;
export type GetChainStateFun = (blockHash: any, callback: CommonFunType) => any;
export type CallAelfContractFun = (params: any, methodName: string, contractAddress: string, method: string) => any;
export type ContractAtFun = (contractAddress: string, wallet: any, ...otherArgsArray: any[]) => any;
export type GetBlockFun = (blockHash: string, includeTxs: string, callback: CommonFunType) => Promise<any> | undefined;
export type GetBlockByHeightFun = (
  blockHeight: string,
  includeTxs: string,
  callback: CommonFunType,
) => Promise<any> | undefined;

export type GetTxResultsFun = (
  blockhash: string,
  offset: number,
  num: number,
  callback: CommonFunType,
) => Promise<any> | undefined;

export type TransactionFun = (rawtx: string, callback: CommonFunType) => Promise<any> | undefined;

export interface ChainFunction {
  getChainStatus?: CommonFunType; // GetChainStatusFun;
  getChainState: GetChainStateFun;
  getContractFileDescriptorSet: (address: any, callback: CommonFunType) => any;
  getBlockHeight: (callback: CommonFunType) => any;
  getBlock: GetBlockFun;
  getBlockByHeight: GetBlockByHeightFun;
  callReadOnly: (rawtx: string, callback: CommonFunType) => Promise<any> | undefined;
  getTxResult: (txhash: string, callback: CommonFunType) => Promise<any> | undefined;
  getTxResults: GetTxResultsFun;
  getTransactionPoolStatus: (callback: CommonFunType) => Promise<any> | undefined;
  sendTransaction: TransactionFun;
  sendTransactions: TransactionFun;
  contractAt: ContractAtFun;
}

export type AElfInstance = {
  appName: string;
  chain: {
    getChainStatus: CommonFunType;
    contractAt: CommonFunType;
    getBlock: CommonFunType;
    getBlockByHeight: CommonFunType;
    getBlockHeight: CommonFunType;
    getChainState: CommonFunType;
    getContractFileDescriptorSet: CommonFunType;
    getTransactionPoolStatus: CommonFunType;
    getTxResult: CommonFunType;
    getTxResults: CommonFunType;
    sendTransaction: CommonFunType;
    sendTransactions: CommonFunType;
    callReadOnly: CommonFunType;
    chainId: string;
  };
  httpProvider: string[];
  pure?: boolean;
};

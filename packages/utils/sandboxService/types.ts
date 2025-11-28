import { ChainType } from '@portkey-wallet/types';

export enum SandboxEventTypes {
  getBalances = 'getBalances',
  // View
  callViewMethod = 'callViewMethod',
  // Send
  callSendMethod = 'callSendMethod',
  // getEncodedTx
  getTransactionFee = 'getTransactionFee',

  initViewContract = 'initViewContract',
}

export enum SandboxErrorCode {
  error,
  success,
} // 0 error 1 success

export type SandboxDispatchData = { code: SandboxErrorCode; message?: any };

export interface DispatchParam {
  chainType: ChainType;
  rpcUrl: string;
  [x: string]: any;
}

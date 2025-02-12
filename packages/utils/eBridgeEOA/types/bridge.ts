import { TLimitData, TokenInfo } from './index';
import { ContractBasic } from '@portkey/contracts';

export interface ICreateReceiptParams {
  tokenContract: ContractBasic;
  // bridgeContract: ContractBasic;
  targetAddress: string;
  amount: string;
  owner: string;
  account: string;
}

export interface ICreateReceiptHandlerParams extends ICreateReceiptParams {
  targetChainId: string | number;
  tokenInfo: TokenInfo;
}

export interface ICheckAndApproveParams {
  tokenContract: ContractBasic;
  symbol: string;
  spender: string;
  owner: string;
  amount: string;
}

export interface IBridgeOperator {
  getFromLimit(toChainId: string, target: string): Promise<TLimitData>;
  getToLimit(toChainId: string, target: string): Promise<TLimitData>;
  createReceipt(params: ICreateReceiptHandlerParams): Promise<any>;
}

export interface IEBridge {
  fromOperator: IBridgeOperator;
  toOperator: IBridgeOperator;
  getLimit(): Promise<TLimitData>;
  getELFFee(): Promise<string>;
  createReceipt(params: ICreateReceiptParams): Promise<any>;
}

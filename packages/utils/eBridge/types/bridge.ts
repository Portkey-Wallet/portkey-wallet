import { TLimitData } from './index';

export interface IBridgeOperator {
  getFromLimit(toChainId: string, target: string): Promise<TLimitData>;
  getToLimit(toChainId: string, target: string): Promise<TLimitData>;
}

export interface IEBridge {
  fromOperator: IBridgeOperator;
  toOperator: IBridgeOperator;
  getLimit(): Promise<TLimitData>;
  getELFFee(): Promise<string>;
  createReceipt(amount: string, targetAddress: string): Promise<any>;
}

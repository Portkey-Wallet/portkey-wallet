import { ChainId } from '@portkey-wallet/types';

export interface ITransferLimitItem {
  chainId: ChainId;
  symbol: string;
  fromSymbol?: string; // back to operate
  singleLimit: string;
  dailyLimit: string;
  restricted: boolean;
  decimals: number | string;
  defaultDailyLimit?: string;
  defaultSingleLimit?: string;
}

export enum ICheckLimitBusiness {
  SEND = 'send',
  RAMP_SELL = 'ramp-sell',
}

export type ITransferLimitRouteState = ITransferLimitItem & { from: ICheckLimitBusiness; targetChainId?: ChainId };

export interface ITransferLimitListResponse {
  data: ITransferLimitItem[];
  totalRecordCount: number;
  code?: number;
  message?: string;
}

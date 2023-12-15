import { ChainId } from '@portkey-wallet/types';

export interface ITransferLimitItem {
  chainId: ChainId;
  symbol: string;
  singleLimit: string;
  dailyLimit: string;
  restricted: boolean;
  decimals: number | string;
  defaultDailyLimit?: string;
  defaultSingleLimit?: string;
  imageUrl?: string;
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

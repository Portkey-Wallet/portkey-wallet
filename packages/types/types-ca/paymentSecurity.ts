import { ChainId } from '@portkey-wallet/types';

export interface IPaymentSecurityItem {
  chainId: ChainId;
  symbol: string;
  singleLimit: string;
  dailyLimit: string;
  restricted: boolean;
  decimals: number | string;
}

export interface ISecurityListResponse {
  data: IPaymentSecurityItem[];
  totalRecordCount: number;
  code?: number;
  message?: string;
}

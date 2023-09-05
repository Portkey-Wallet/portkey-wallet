import { ChainId } from '@portkey-wallet/types';

export interface IPaymentSecurityItem {
  chainId: ChainId;
  symbol: string;
  singleLimit: number;
  dailyLimit: number;
  restricted: boolean;
}

export interface ISecurityListResponse {
  data: IPaymentSecurityItem[];
  totalRecordCount: number;
  code?: number;
  message?: string;
}

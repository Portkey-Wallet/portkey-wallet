import { ChainId } from '@portkey-wallet/types';

export interface IPaymentSecurityItem {
  chainId: ChainId;
  symbol: string;
  singleLimit: number;
  dailyLimit: number;
  restricted: boolean;
}

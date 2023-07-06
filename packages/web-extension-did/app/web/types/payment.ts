import { FiatType } from '@portkey-wallet/store/store-ca/payment/type';
import { ChainId } from '@portkey/provider-types';

export type PartialFiatType = Partial<FiatType>;

export type TokenType = {
  symbol: string;
  chainId: ChainId;
};

export interface IFetchOrderQuote {
  crypto: string;
  network: string;
  fiat: string;
  country: string;
  amount: string;
  side: string;
}

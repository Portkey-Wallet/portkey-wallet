import { FiatType } from '@portkey-wallet/store/store-ca/payment/type';
import { ChainId } from '@portkey-wallet/types';
import { ICurToken } from './components/TokenInput';
import { PaymentTypeEnum } from '@portkey-wallet/types/types-ca/payment';

export const sellSoonText = 'Off-ramp is currently not supported. It will be launched in the coming weeks.';

export const soonText = 'On-ramp is not supported on the Testnet. The on-ramp service on Mainnet is coming soon.';

export const disclaimer =
  'AlchemyPay is a fiat-to-crypto platform independently operated by a third-party entity. Portkey shall not be held liable for any losses or damages suffered as a result of using AlchemyPay services. ';

export enum DrawerType {
  token,
  currency,
}

export type PartialFiatType = Partial<FiatType>;

export type TokenType = {
  symbol: string;
  chainId: ChainId;
};

export const initToken: ICurToken = {
  crypto: 'ELF',
  network: 'ELF', // TODO 'AELF'
};

export const initFiat: PartialFiatType = {
  country: 'US',
  currency: 'USD',
};

export const MAX_UPDATE_TIME = 15;
export const initCurrency = '200';
export const initCrypto = '400';
export const initValueSave: {
  amount: string;
  currency: string;
  country: string;
  crypto: string;
  network: string;
  min: number | null;
  max: number | null;
  side: PaymentTypeEnum;
  receive: string;
  isShowErrMsg: boolean;
} = {
  amount: initCurrency,
  currency: 'USD',
  country: 'US',
  crypto: 'ELF',
  network: 'ELF', // TODO 'AELF'
  min: null,
  max: null,
  side: PaymentTypeEnum.BUY,
  receive: '',
  isShowErrMsg: false,
};

export interface IFetchOrderQuote {
  crypto: string;
  network: string;
  fiat: string;
  country: string;
  amount: string;
  side: string;
}

export const initPreviewData = {
  crypto: 'ELF',
  network: 'ELF', // TODO 'AELF'
  fiat: 'USD',
  country: 'US',
  amount: '200',
  side: PaymentTypeEnum.BUY,
};

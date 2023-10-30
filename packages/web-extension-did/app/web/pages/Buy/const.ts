import { FiatType } from '@portkey-wallet/store/store-ca/payment/type';
import { ChainId } from '@portkey-wallet/types';
import { ICurToken } from './components/TokenInput';
import { PaymentTypeEnum } from '@portkey-wallet/types/types-ca/payment';

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

export const initPreviewData = {
  crypto: 'ELF',
  network: 'ELF', // TODO 'AELF'
  fiat: 'USD',
  country: 'US',
  amount: '200',
  side: PaymentTypeEnum.BUY,
};

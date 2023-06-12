import { ACH_MERCHANT_NAME } from '@portkey-wallet/constants/constants-ca/payment';
import { SendResult } from '@portkey-wallet/contracts/types';

export interface CountryItem {
  country: string;
  iso: string;
  icon: string;
}

export type PaymentMerchantType = typeof ACH_MERCHANT_NAME;

export interface AchTxAddressReceivedType {
  merchantName: PaymentMerchantType;
  orderId: string;
  crypto: string;
  network: string;
  cryptoAmount: string;
  address: string;
}

export type SellTransferParams = Pick<AchTxAddressReceivedType, 'merchantName' | 'orderId'> & {
  paymentSellTransfer: (params: AchTxAddressReceivedType) => Promise<SendResult>;
};

export enum PaymentTypeEnum {
  BUY = 'BUY',
  SELL = 'SELL',
}

export interface PaymentLimitType {
  min: number;
  max: number;
}

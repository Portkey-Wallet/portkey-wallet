import { ACH_MERCHANT_NAME } from 'packages/constants/constants-ca/payment';

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

export interface RequestOrderTransferredType extends AchTxAddressReceivedType {
  status: 'Transferred' | 'TransferFailed';
}

export interface PaymentSellTransferResult {
  publicKey: string;
  signature: string; // sign(md5(orderId + rawTransaction))
  rawTransaction: string;
}

export type SellTransferParams = Pick<AchTxAddressReceivedType, 'merchantName' | 'orderId'> & {
  paymentSellTransfer: (params: AchTxAddressReceivedType) => Promise<PaymentSellTransferResult>;
};

export enum PaymentTypeEnum {
  BUY = 'BUY',
  SELL = 'SELL',
}

export interface PaymentLimitType {
  min: number;
  max: number;
}

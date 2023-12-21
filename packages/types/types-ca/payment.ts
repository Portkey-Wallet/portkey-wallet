import { ACH_MERCHANT_NAME } from '@portkey-wallet/constants/constants-ca/payment';
import { GuardiansApprovedType } from './guardian';

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
  paymentSellTransfer: (
    params: AchTxAddressReceivedType,
    guardiansApproved?: GuardiansApprovedType[],
  ) => Promise<PaymentSellTransferResult>;
  guardiansApproved?: GuardiansApprovedType[];
};

export enum PaymentTypeEnum {
  BUY = 'BUY',
  SELL = 'SELL',
}

export interface PaymentLimitType {
  min: number;
  max: number;
}

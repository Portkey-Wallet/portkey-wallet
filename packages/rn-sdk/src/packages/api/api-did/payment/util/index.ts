import { request } from 'packages/api/api-did';
import { CryptoInfoType, GetAchTokenDataType, OrderQuoteType } from '../type';
import { TransDirectEnum } from 'packages/constants/constants-ca/payment';
import { PaymentTypeEnum } from 'packages/types/types-ca/payment';

export interface GetOrderQuoteParamsType {
  crypto: string;
  network: string;
  fiat: string;
  country: string;
  amount: string;
  side: string;
}
export const getOrderQuote = async (params: GetOrderQuoteParamsType) => {
  const rst = await request.payment.getOrderQuote({
    params: {
      ...params,
      type: 'ONE',
    },
  });
  if (rst.returnCode !== '0000') {
    throw new Error(rst.returnMsg);
  }
  return rst.data as OrderQuoteType;
};

export const getCryptoInfo = async (
  params: { fiat: string },
  symbol: string,
  network: string,
  side: PaymentTypeEnum,
) => {
  const rst = await request.payment.getCryptoList({
    params,
  });
  if (rst.returnCode !== '0000') {
    throw new Error(rst.returnMsg);
  }
  return (rst.data as CryptoInfoType[]).find(
    (item: any) =>
      item.crypto === symbol &&
      item.network === network &&
      (side === PaymentTypeEnum.BUY ? Number(item.buyEnable) === 1 : Number(item.sellEnable) === 1),
  );
};

export const getCryptoList = async (params: { fiat: string }) => {
  const rst = await request.payment.getCryptoList({
    params,
  });
  if (rst.returnCode !== '0000') {
    throw new Error(rst.returnMsg);
  }
  return rst.data as CryptoInfoType[];
};

export const getAchToken = async (params: { email: string }) => {
  const rst = await request.payment.getAchToken({
    params,
  });
  if (rst.returnCode !== '0000') {
    throw new Error(rst.returnMsg);
  }
  return rst.data as GetAchTokenDataType;
};

export const getPaymentOrderNo = async (params: { transDirect: TransDirectEnum; merchantName: string }) => {
  const rst = await request.payment.getOrderNo({
    params,
  });

  if (rst.success !== true || !rst?.id) {
    throw new Error(rst.returnMsg);
  }
  return rst.id as string;
};

export const getAchSignature = async (params: { address: string }) => {
  const rst = await request.payment.getAchSignature({
    params,
  });
  console.log('getAchSignature', rst);
  if (rst.returnCode !== '0000' || !rst?.signature) {
    throw new Error(rst.returnMsg);
  }

  return rst.signature as string;
};

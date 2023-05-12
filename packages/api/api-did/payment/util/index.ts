import { request } from '@portkey-wallet/api/api-did';
import { CryptoInfoType, GetAchTokenDataType, OrderQuoteType } from '../type';
import { TransDirectEnum } from '@portkey-wallet/constants/constants-ca/payment';

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

export const getCryptoInfo = async (params: { fiat: string }, symbol: string, _chainId: string) => {
  // FIXME _chainId to chainId
  console.log(
    'At present, only the main network is connected to legal currency, and the test is the faucet. If the test network is connected to legal currency, chainId will be used',
  );

  const rst = await request.payment.getCryptoList({
    params,
  });
  if (rst.returnCode !== '0000') {
    throw new Error(rst.returnMsg);
  }
  return (rst.data as CryptoInfoType[]).find((item: any) => item.crypto === symbol && item.network === symbol);
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

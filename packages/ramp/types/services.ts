import { IRampProviderType } from '../constants';
import { IRampProviderInfo } from './provider';

export type IRampServiceCommon<T> = Promise<{
  code: string;
  message: string;
  data: T;
}>;

export type IRampInfoResult = {
  thirdPart: IThirdPartsInfo;
};

export type IThirdPartsInfo = Record<keyof typeof IRampProviderType, IThirdPartInfo>;

export type IThirdPartInfo = Omit<IRampProviderInfo, 'key'>;

export type IRampCryptoItem = {
  symbol: string;
  icon: string;
  decimals: number;
  network: string; // chain-chainId
  address: string;
};

export type IRampCryptoDefault = {
  symbol: string;
  amount: string;
  network: string; // chain-chainId
};

export type IRampFiatItem = {
  country: string;
  symbol: string;
  countryName: string;
  icon: string;
};

export type IRampFiatDefault = {
  symbol: string;
  amount: string;
  country: string;
  countryName: string;
};

export type IRampCryptoResult = {
  cryptoList: IRampCryptoItem[];
  defaultCrypto: IRampCryptoDefault;
};

export type IRampFiatResult = {
  fiatList: IRampFiatItem[];
  defaultFiat: IRampFiatDefault;
};

export type IBuyLimitResult = {
  fiat: IRampLimit;
};

export type ISellLimitResult = {
  crypto: IRampLimit;
};

export type IRampLimit = {
  symbol: string;
  minLimit: string;
  maxLimit: string;
};

export type IRampExchangeResult = {
  exchange: string;
};

export type IRampPriceResult = {
  cryptoAmount: string;
  fiatAmount: string;
  exchange: string;
  feeInfo: IFeeInfo;
};

export type IBuyPriceResult = Omit<IRampPriceResult, 'fiatAmount'>;

export type ISellPriceResult = Omit<IRampPriceResult, 'cryptoAmount'>;

export type IFeeInfo = {
  rampFee: IFeeItem;
  networkFee: IFeeItem;
};

export type IFeeItem = {
  type: ICurrencyType;
  price: string;
  symbol: string;
};

export type ICurrencyType = 'FIAT' | 'CRYPTO';

export type IBuyDetailResult = {
  providersList: IBuyProviderDetail[];
};

export type ISellDetailResult = {
  providersList: ISellProviderDetail[];
};

export type IProviderDetail = {
  thirdPart: IRampProviderType;
  fiatAmount: string;
  cryptoAmount: string;
  exchange: string;
  feeInfo: IFeeInfo;
};

export type IBuyProviderDetail = Omit<IProviderDetail, 'fiatAmount'>;

export type ISellProviderDetail = Omit<IProviderDetail, 'cryptoAmount'>;

export enum ITransDirectEnum {
  TOKEN_BUY = 'TokenBuy',
  TOKEN_SELL = 'TokenSell',
}

export type IGetOrderNoRequest = {
  transDirect: ITransDirectEnum;
  merchantName: string;
};

export type IGetCryptoDataRequest = {
  fiat?: string;
  country?: string;
};

export type IGetFiatDataRequest = {
  crypto?: string;
  network?: string;
};

export type IGetLimitRequest = {
  crypto: string;
  network: string;
  fiat: string;
  country: string;
};

export type IGetExchangeRequest = {
  crypto: string;
  network: string;
  fiat: string;
  country: string;
};

export type IGetRampDetailRequest = {
  network: string;
  crypto: string;
  fiat: string;
  country: string;
  fiatAmount: string;
  cryptoAmount: string;
};

export type IGetBuyDetailRequest = Omit<IGetRampDetailRequest, 'cryptoAmount'>;

export type IGetSellDetailRequest = Omit<IGetRampDetailRequest, 'fiatAmount'>;

export type IGetBuyPriceRequest = IGetBuyDetailRequest;

export type IGetSellPriceRequest = IGetSellDetailRequest;

export type IGetSellTransactionRequest = {
  merchantName: string;
  orderId: string;
  rawTransaction: string;
  signature: string;
  publicKey: string;
};

export type IGetOrderNoResult = {
  orderNo: string;
};

export type IGetAchTokenRequest = {
  email: string;
};

export type IGetAchTokenResult = {
  email: string;
  accessToken: string;
};

export type IGetAchSignatureRequest = {
  address: string;
};

export type IGetAchSignatureResult = {
  signature: string;
};

export interface IRampService {
  getRampInfo: () => IRampServiceCommon<IRampInfoResult>;

  getBuyCryptoData: (params?: IGetCryptoDataRequest) => IRampServiceCommon<IRampCryptoResult>;
  getBuyFiatData: (params?: IGetFiatDataRequest) => IRampServiceCommon<IRampFiatResult>;
  getBuyLimit: (params: IGetLimitRequest) => IRampServiceCommon<IBuyLimitResult>;
  getBuyExchange: (params: IGetExchangeRequest) => IRampServiceCommon<IRampExchangeResult>;
  getBuyPrice: (params: IGetBuyPriceRequest) => IRampServiceCommon<IBuyPriceResult>;
  getBuyDetail: (params: IGetBuyDetailRequest) => IRampServiceCommon<IBuyDetailResult>;

  getSellCryptoData: (params?: IGetCryptoDataRequest) => IRampServiceCommon<IRampCryptoResult>;
  getSellFiatData: (params?: IGetFiatDataRequest) => IRampServiceCommon<IRampFiatResult>;
  getSellLimit: (params: IGetLimitRequest) => IRampServiceCommon<ISellLimitResult>;
  getSellExchange: (params: IGetExchangeRequest) => IRampServiceCommon<IRampExchangeResult>;
  getSellPrice: (params: IGetSellPriceRequest) => IRampServiceCommon<ISellPriceResult>;
  getSellDetail: (params: IGetSellDetailRequest) => IRampServiceCommon<ISellDetailResult>;

  sendSellTransaction: (params: IGetSellTransactionRequest) => IRampServiceCommon<void>;
  getOrderNo: (params: IGetOrderNoRequest) => IRampServiceCommon<{ orderNo: string }>;

  // for ach
  getAchToken: (params: IGetAchTokenRequest) => IRampServiceCommon<IGetAchTokenResult>;
  getAchSignature: (params: IGetAchSignatureRequest) => IRampServiceCommon<IGetAchSignatureResult>;
}

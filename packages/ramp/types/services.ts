import { ChainId } from '@portkey-wallet/types';
import { IClientType, IRampProviderInfo, IRampRequest, IRequestConfig, ITransDirectEnum } from './index';
import { IRampProviderType } from '..';

export type IRampServiceOptions = IRequestConfig & {
  request: IRampRequest;
};

export type IRampServiceCommon<T> = Promise<{
  code: string;
  message: string;
  data: T;
  success: boolean;
}>;

export type IRampInfoResult = {
  thirdPart: IThirdPartsInfo;
};

export type IThirdPartsInfo = Record<IRampProviderType, IThirdPartInfo>;

export type IThirdPartInfo = Omit<IRampProviderInfo, 'key'>;

export type IRampCryptoItem = {
  symbol: string;
  icon: string;
  decimals: number;
  network: string;
  chainId: ChainId;
  address: string;
};

export type IRampCryptoDefault = {
  symbol: string;
  amount: string;
  network: string;
  chainId: ChainId;
  icon: string;
};

export type IRampFiatItem = {
  country: string;
  symbol: string;
  countryName: string;
  icon: string;
};

export type IRampFiatDefault = IRampFiatItem & {
  amount: string;
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
  fiat: IRampLimitResult;
};

export type ISellLimitResult = {
  crypto: IRampLimitResult;
};

export type IRampLimitResult = {
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
  amount: string;
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
  providerNetwork: string;
  providerSymbol: string;
};

export type IBuyProviderDetail = Omit<IProviderDetail, 'fiatAmount'>;

export type ISellProviderDetail = Omit<IProviderDetail, 'cryptoAmount'>;

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
  orderId: string;
};

export type IGetAchPayTokenRequest = {
  email: string;
};

export type IGetAchPayTokenResult = {
  email: string;
  accessToken: string;
};

export type IGetAchPaySignatureRequest = {
  address: string;
};

export type IGetAchPaySignatureResult = {
  signature: string;
};

export interface IRampService {
  request: IRampRequest;
  baseUrl?: string;
  clientType?: IClientType;

  setRequestOptions(options: IRequestConfig): void;
  getRampInfo(): IRampServiceCommon<IRampInfoResult>;

  getBuyCryptoData(params?: IGetCryptoDataRequest): IRampServiceCommon<IRampCryptoResult>;
  getBuyFiatData(params?: IGetFiatDataRequest): IRampServiceCommon<IRampFiatResult>;
  getBuyLimit(params: IGetLimitRequest): IRampServiceCommon<IBuyLimitResult>;
  getBuyExchange(params: IGetExchangeRequest): IRampServiceCommon<IRampExchangeResult>;
  getBuyPrice(params: IGetBuyPriceRequest): IRampServiceCommon<IBuyPriceResult>;
  getBuyDetail(params: IGetBuyDetailRequest): IRampServiceCommon<IBuyDetailResult>;

  getSellCryptoData(params?: IGetCryptoDataRequest): IRampServiceCommon<IRampCryptoResult>;
  getSellFiatData(params?: IGetFiatDataRequest): IRampServiceCommon<IRampFiatResult>;
  getSellLimit(params: IGetLimitRequest): IRampServiceCommon<ISellLimitResult>;
  getSellExchange(params: IGetExchangeRequest): IRampServiceCommon<IRampExchangeResult>;
  getSellPrice(params: IGetSellPriceRequest): IRampServiceCommon<ISellPriceResult>;
  getSellDetail(params: IGetSellDetailRequest): IRampServiceCommon<ISellDetailResult>;

  sendSellTransaction(params: IGetSellTransactionRequest): IRampServiceCommon<void>;
  getOrderNo(params: IGetOrderNoRequest): IRampServiceCommon<IGetOrderNoResult>;
}

export interface IAlchemyPayRampService extends IRampService {
  getAchPayToken(params: IGetAchPayTokenRequest): IRampServiceCommon<IGetAchPayTokenResult>;
  getAchPaySignature(params: IGetAchPaySignatureRequest): IRampServiceCommon<IGetAchPaySignatureResult>;
}

import {
  IAlchemyPayRampService,
  IBuyDetailResult,
  IBuyLimitResult,
  IBuyPriceResult,
  IGetAchPaySignatureRequest,
  IGetAchPaySignatureResult,
  IGetAchPayTokenRequest,
  IGetAchPayTokenResult,
  IGetBuyDetailRequest,
  IGetBuyPriceRequest,
  IGetCryptoDataRequest,
  IGetExchangeRequest,
  IGetFiatDataRequest,
  IGetLimitRequest,
  IGetOrderNoRequest,
  IGetOrderNoResult,
  IGetSellDetailRequest,
  IGetSellPriceRequest,
  IGetSellTransactionRequest,
  IRampCryptoResult,
  IRampExchangeResult,
  IRampFiatResult,
  IRampInfoResult,
  IRampService,
  IRampServiceCommon,
  IRampServiceOptions,
  ISellDetailResult,
  ISellLimitResult,
  ISellPriceResult,
} from '../types/services';
import RampApi from '../api';
import { RampType } from '../constants';
import { IClientType, IRampRequest, IRequestConfig } from '../types';

export class RampService implements IRampService {
  public baseUrl: string;
  public clientType: IClientType;
  public request: IRampRequest;

  constructor(options: IRampServiceOptions) {
    this.baseUrl = options?.baseUrl || '';
    this.clientType = options?.clientType || 'Android';
    this.request = options?.request;
  }

  setRequestOptions(options: IRequestConfig) {
    this.baseUrl = options?.baseUrl || this.baseUrl;
    this.clientType = options?.clientType || this.clientType;
  }

  getRampInfo(): IRampServiceCommon<IRampInfoResult> {
    return this.request.send(this.baseUrl, {
      url: RampApi.getRampInfo.target,
      method: RampApi.getRampInfo.config.method,
      headers: {
        'Client-Type': this.clientType,
      },
    });
  }
  getBuyCryptoData(params?: IGetCryptoDataRequest): IRampServiceCommon<IRampCryptoResult> {
    return this.request.send(this.baseUrl, {
      url: RampApi.getCrypto.target,
      method: RampApi.getCrypto.config.method,
      params: { type: RampType.BUY, ...params },
      headers: {
        'Client-Type': this.clientType,
      },
    });
  }
  getBuyFiatData(params?: IGetFiatDataRequest): IRampServiceCommon<IRampFiatResult> {
    return this.request.send(this.baseUrl, {
      url: RampApi.getFiat.target,
      method: RampApi.getFiat.config.method,
      params: { type: RampType.BUY, ...params },
      headers: {
        'Client-Type': this.clientType,
      },
    });
  }
  getBuyLimit(params: IGetLimitRequest): IRampServiceCommon<IBuyLimitResult> {
    return this.request.send(this.baseUrl, {
      url: RampApi.getRampLimit.target,
      method: RampApi.getRampLimit.config.method,
      params: { type: RampType.BUY, ...params },
      headers: {
        'Client-Type': this.clientType,
      },
    });
  }
  getBuyExchange(params: IGetExchangeRequest): IRampServiceCommon<IRampExchangeResult> {
    return this.request.send(this.baseUrl, {
      url: RampApi.getRampExchange.target,
      method: RampApi.getRampExchange.config.method,
      params: { type: RampType.BUY, ...params },
      headers: {
        'Client-Type': this.clientType,
      },
    });
  }
  getBuyPrice(params: IGetBuyPriceRequest): IRampServiceCommon<IBuyPriceResult> {
    return this.request.send(this.baseUrl, {
      url: RampApi.getRampPrice.target,
      method: RampApi.getRampPrice.config.method,
      params: { type: RampType.BUY, ...params },
      headers: {
        'Client-Type': this.clientType,
      },
    });
  }
  getBuyDetail(params: IGetBuyDetailRequest): IRampServiceCommon<IBuyDetailResult> {
    return this.request.send(this.baseUrl, {
      url: RampApi.getRampDetail.target,
      method: RampApi.getRampDetail.config.method,
      params: { type: RampType.BUY, ...params },
      headers: {
        'Client-Type': this.clientType,
      },
    });
  }
  getSellCryptoData(params?: IGetCryptoDataRequest): IRampServiceCommon<IRampCryptoResult> {
    return this.request.send(this.baseUrl, {
      url: RampApi.getCrypto.target,
      method: RampApi.getCrypto.config.method,
      params: { type: RampType.SELL, ...params },
      headers: {
        'Client-Type': this.clientType,
      },
    });
  }
  getSellFiatData(params?: IGetFiatDataRequest): IRampServiceCommon<IRampFiatResult> {
    return this.request.send(this.baseUrl, {
      url: RampApi.getFiat.target,
      method: RampApi.getFiat.config.method,
      params: { type: RampType.SELL, ...params },
      headers: {
        'Client-Type': this.clientType,
      },
    });
  }
  getSellLimit(params: IGetLimitRequest): IRampServiceCommon<ISellLimitResult> {
    return this.request.send(this.baseUrl, {
      url: RampApi.getRampLimit.target,
      method: RampApi.getRampLimit.config.method,
      params: { type: RampType.SELL, ...params },
      headers: {
        'Client-Type': this.clientType,
      },
    });
  }
  getSellExchange(params: IGetExchangeRequest): IRampServiceCommon<IRampExchangeResult> {
    return this.request.send(this.baseUrl, {
      url: RampApi.getRampExchange.target,
      method: RampApi.getRampExchange.config.method,
      params: { type: RampType.SELL, ...params },
      headers: {
        'Client-Type': this.clientType,
      },
    });
  }
  getSellPrice(params: IGetSellPriceRequest): IRampServiceCommon<ISellPriceResult> {
    return this.request.send(this.baseUrl, {
      url: RampApi.getRampPrice.target,
      method: RampApi.getRampPrice.config.method,
      params: { type: RampType.SELL, ...params },
      headers: {
        'Client-Type': this.clientType,
      },
    });
  }
  getSellDetail(params: IGetSellDetailRequest): IRampServiceCommon<ISellDetailResult> {
    return this.request.send(this.baseUrl, {
      url: RampApi.getRampDetail.target,
      method: RampApi.getRampDetail.config.method,
      params: { type: RampType.SELL, ...params },
      headers: {
        'Client-Type': this.clientType,
      },
    });
  }
  sendSellTransaction(params: IGetSellTransactionRequest): IRampServiceCommon<any> {
    return this.request.send(this.baseUrl, {
      url: RampApi.sendSellTransaction.target,
      method: RampApi.sendSellTransaction.config.method,
      params,
    });
  }
  getOrderNo(params: IGetOrderNoRequest): IRampServiceCommon<IGetOrderNoResult> {
    return this.request.send(this.baseUrl, {
      url: RampApi.getOrderNo.target,
      method: RampApi.getOrderNo.config.method,
      params,
    });
  }
}

export class AlchemyPayRampService extends RampService implements IAlchemyPayRampService {
  constructor(options: IRampServiceOptions) {
    super(options);
  }

  getAchPayToken(params: IGetAchPayTokenRequest): IRampServiceCommon<IGetAchPayTokenResult> {
    return this.request.send(this.baseUrl, {
      url: RampApi.getAchPayToken.target,
      method: RampApi.getAchPayToken.config.method,
      params,
    });
  }
  getAchPaySignature(params: IGetAchPaySignatureRequest): IRampServiceCommon<IGetAchPaySignatureResult> {
    return this.request.send(this.baseUrl, {
      url: RampApi.getAchPaySignature.target,
      method: RampApi.getAchPaySignature.config.method,
      params,
    });
  }
}

export * from '../signalr';

import { request } from '@portkey-wallet/api/api-did';
import {
  IBuyDetailResult,
  IBuyLimitResult,
  IBuyPriceResult,
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
  ISellDetailResult,
  ISellLimitResult,
  ISellPriceResult,
} from '../types/services';
import RampApi from '../api';
import { RampType } from '../constants';
import { IRampRequestConfig } from '../types';

export class RampService implements IRampService {
  public baseUrl: string;

  constructor(options: IRampRequestConfig) {
    this.baseUrl = options.baseUrl;
  }

  getRampInfo(): IRampServiceCommon<IRampInfoResult> {
    return request.send(this.baseUrl, {
      url: RampApi.getRampInfo.target,
      method: RampApi.getRampInfo.config.method,
    });
  }
  getBuyCryptoData(params?: IGetCryptoDataRequest): IRampServiceCommon<IRampCryptoResult> {
    return request.send(this.baseUrl, {
      url: RampApi.getCrypto.target,
      method: RampApi.getCrypto.config.method,
      params: { type: RampType.BUY, ...params },
    });
  }
  getBuyFiatData(params?: IGetFiatDataRequest): IRampServiceCommon<IRampFiatResult> {
    return request.send(this.baseUrl, {
      url: RampApi.getFiat.target,
      method: RampApi.getFiat.config.method,
      params: { type: RampType.BUY, ...params },
    });
  }
  getBuyLimit(params: IGetLimitRequest): IRampServiceCommon<IBuyLimitResult> {
    return request.send(this.baseUrl, {
      url: RampApi.getRampLimit.target,
      method: RampApi.getRampLimit.config.method,
      params: { type: RampType.BUY, ...params },
    });
  }
  getBuyExchange(params: IGetExchangeRequest): IRampServiceCommon<IRampExchangeResult> {
    return request.send(this.baseUrl, {
      url: RampApi.getRampExchange.target,
      method: RampApi.getRampExchange.config.method,
      params: { type: RampType.BUY, ...params },
    });
  }
  getBuyPrice(params: IGetBuyPriceRequest): IRampServiceCommon<IBuyPriceResult> {
    return request.send(this.baseUrl, {
      url: RampApi.getRampPrice.target,
      method: RampApi.getRampPrice.config.method,
      params: { type: RampType.BUY, ...params },
    });
  }
  getBuyDetail(params: IGetBuyDetailRequest): IRampServiceCommon<IBuyDetailResult> {
    return request.send(this.baseUrl, {
      url: RampApi.getRampDetail.target,
      method: RampApi.getRampDetail.config.method,
      params: { type: RampType.BUY, ...params },
    });
  }
  getSellCryptoData(params?: IGetCryptoDataRequest): IRampServiceCommon<IRampCryptoResult> {
    return request.send(this.baseUrl, {
      url: RampApi.getCrypto.target,
      method: RampApi.getCrypto.config.method,
      params: { type: RampType.SELL, ...params },
    });
  }
  getSellFiatData(params?: IGetFiatDataRequest): IRampServiceCommon<IRampFiatResult> {
    return request.send(this.baseUrl, {
      url: RampApi.getFiat.target,
      method: RampApi.getFiat.config.method,
      params: { type: RampType.SELL, ...params },
    });
  }
  getSellLimit(params: IGetLimitRequest): IRampServiceCommon<ISellLimitResult> {
    return request.send(this.baseUrl, {
      url: RampApi.getRampLimit.target,
      method: RampApi.getRampLimit.config.method,
      params: { type: RampType.SELL, ...params },
    });
  }
  getSellExchange(params: IGetExchangeRequest): IRampServiceCommon<IRampExchangeResult> {
    return request.send(this.baseUrl, {
      url: RampApi.getRampExchange.target,
      method: RampApi.getRampExchange.config.method,
      params: { type: RampType.SELL, ...params },
    });
  }
  getSellPrice(params: IGetSellPriceRequest): IRampServiceCommon<ISellPriceResult> {
    return request.send(this.baseUrl, {
      url: RampApi.getRampPrice.target,
      method: RampApi.getRampPrice.config.method,
      params: { type: RampType.SELL, ...params },
    });
  }
  getSellDetail(params: IGetSellDetailRequest): IRampServiceCommon<ISellDetailResult> {
    return request.send(this.baseUrl, {
      url: RampApi.getRampDetail.target,
      method: RampApi.getRampDetail.config.method,
      params: { type: RampType.SELL, ...params },
    });
  }
  sendSellTransaction(params: IGetSellTransactionRequest): IRampServiceCommon<any> {
    return request.send(this.baseUrl, {
      url: RampApi.sendSellTransaction,
      params,
    });
  }
  getOrderNo(params: IGetOrderNoRequest): IRampServiceCommon<IGetOrderNoResult> {
    return request.send(this.baseUrl, {
      url: RampApi.getOrderNo,
      params,
    });
  }
}

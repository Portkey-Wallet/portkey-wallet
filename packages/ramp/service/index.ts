import {
  IBuyDetailResult,
  IBuyLimitResult,
  IBuyPriceResult,
  IGetAchSignatureRequest,
  IGetAchSignatureResult,
  IGetAchTokenRequest,
  IGetAchTokenResult,
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
import { IClientType, IRequestConfig } from '../types';
import { request } from '@portkey-wallet/api/api-did';

export class RampService implements IRampService {
  public baseUrl: string;
  public clientType: IClientType;

  constructor(options: IRequestConfig) {
    this.baseUrl = options?.baseUrl || '';
    this.clientType = options?.clientType || 'iOS';
  }

  getRampInfo(): IRampServiceCommon<IRampInfoResult> {
    return request.send(this.baseUrl, {
      url: RampApi.getRampInfo.target,
      method: RampApi.getRampInfo.config.method,
      headers: {
        ClientType: this.clientType,
      },
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
      url: RampApi.sendSellTransaction.target,
      method: RampApi.sendSellTransaction.config.method,
      params,
    });
  }
  getOrderNo(params: IGetOrderNoRequest): IRampServiceCommon<IGetOrderNoResult> {
    return request.send(this.baseUrl, {
      url: RampApi.getOrderNo.target,
      method: RampApi.getOrderNo.config.method,
      params,
    });
  }

  // for ach
  getAchToken(params: IGetAchTokenRequest): IRampServiceCommon<IGetAchTokenResult> {
    return request.send(this.baseUrl, {
      url: RampApi.getAchToken.target,
      method: RampApi.getAchToken.config.method,
      params,
    });
  }
  getAchSignature(params: IGetAchSignatureRequest): IRampServiceCommon<IGetAchSignatureResult> {
    return request.send(this.baseUrl, {
      url: RampApi.getAchSignature.target,
      method: RampApi.getAchSignature.config.method,
      params,
    });
  }
}

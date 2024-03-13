import { RampType } from '../constants';
import {
  IRampProviderInfo,
  IRampService,
  IRampProviderOptions,
  IAlchemyPayRampService,
  IAlchemyPayRampProviderOptions,
  IAlchemyPayProvider,
  IRampProviderCreateOrderParams,
  IRampProvider,
  IRampProviderCreateOrderResult,
  ITransDirectEnum,
  IGetOrderNoRequest,
} from '../types';
import { stringifyUrl } from 'query-string';
import { validateError } from '../utils';
import { PortkeyConfig as GlobalConfig } from 'global/config';
import { selectCurrentBackendConfig } from 'utils/commonUtil';
import { PortkeyConfig } from 'global/constants';

export abstract class RampProvider implements IRampProvider {
  public providerInfo: IRampProviderInfo;
  public service: IRampService;

  constructor(options: IRampProviderOptions) {
    this.providerInfo = options.providerInfo;
    this.service = options.service;
  }

  public async getOrderId(params: IGetOrderNoRequest) {
    const { data, message, success, code } = await this.service.getOrderNo(params);
    validateError(message, success, code);
    return data.orderId;
  }

  abstract createOrder(params: IRampProviderCreateOrderParams): Promise<IRampProviderCreateOrderResult>;
}

export class AlchemyPayProvider extends RampProvider implements IAlchemyPayProvider {
  public providerInfo: IRampProviderInfo;
  public service: IAlchemyPayRampService;

  constructor(options: IAlchemyPayRampProviderOptions) {
    super(options);
    this.providerInfo = options.providerInfo;
    this.service = options.service;
  }

  public async createOrder(params: IRampProviderCreateOrderParams): Promise<IRampProviderCreateOrderResult> {
    const { baseUrl, appId, key, callbackUrl } = this.providerInfo;
    const { type, network, country, fiat, crypto, amount, email, withdrawUrl } = params;
    let address = params.address;
    try {
      const apiUrl = await PortkeyConfig.endPointUrl();
      const { rampTestEoaAddress } = selectCurrentBackendConfig(apiUrl);
      if (rampTestEoaAddress) {
        address = rampTestEoaAddress;
      } else {
        const globalRampTestEoaAddress = GlobalConfig.config.networkConfig.rampTestEoaAddress;
        if (globalRampTestEoaAddress) {
          address = globalRampTestEoaAddress;
        }
      }
    } catch (e) {
      console.log('address cal failed');
    }
    let handleOrderUrl = `${baseUrl}/?type=${type.toLocaleLowerCase()}&crypto=${crypto}&network=${network}&country=${country}&fiat=${fiat}&appId=${appId}&callbackUrl=${encodeURIComponent(
      `${callbackUrl}`,
    )}`;

    const orderId = await this.getOrderId({
      transDirect: type === RampType.BUY ? ITransDirectEnum.TOKEN_BUY : ITransDirectEnum.TOKEN_SELL,
      merchantName: key,
    });

    if (orderId) handleOrderUrl += `&merchantOrderNo=${orderId}`;

    if (type === RampType.BUY) {
      handleOrderUrl += `&fiatAmount=${amount}`;

      if (email) {
        const achTokenInfo = await this.getToken(email);
        if (achTokenInfo !== undefined) {
          handleOrderUrl += `&token=${encodeURIComponent(achTokenInfo.accessToken)}`;
        }
      }

      const signature = await this.getSignature(address);
      handleOrderUrl += `&address=${address}&sign=${encodeURIComponent(signature)}`;
      if (withdrawUrl) handleOrderUrl += `&withdrawUrl=${encodeURIComponent(withdrawUrl)}`;
    } else {
      const withdrawUrlTrans = encodeURIComponent(
        withdrawUrl + `&payload=${encodeURIComponent(JSON.stringify({ orderNo: orderId }))}`,
      );

      handleOrderUrl += `&cryptoAmount=${amount}&withdrawUrl=${withdrawUrlTrans}&source=3#/sell-formUserInfo`;
    }

    return { orderId, url: handleOrderUrl };
  }

  public async getToken(email: string) {
    const { data, success, code, message } = await this.service.getAchPayToken({ email });
    validateError(message, success, code);
    return data;
  }

  public async getSignature(address: string) {
    const { data, success, code, message } = await this.service.getAchPaySignature({ address });
    validateError(message, success, code);
    return data.signature;
  }
}

export class TransakProvider extends RampProvider implements IRampProvider {
  public providerInfo: IRampProviderInfo;
  public service: IRampService;

  constructor(options: IRampProviderOptions) {
    super(options);
    this.providerInfo = options.providerInfo;
    this.service = options.service;
  }

  async createOrder(params: IRampProviderCreateOrderParams): Promise<IRampProviderCreateOrderResult> {
    const { baseUrl, appId, key } = this.providerInfo;
    const { type, network, country, fiat, crypto, amount, address, email, withdrawUrl } = params;

    const orderId = await this.getOrderId({
      transDirect: type === RampType.BUY ? ITransDirectEnum.TOKEN_BUY : ITransDirectEnum.TOKEN_SELL,
      merchantName: key,
    });

    if (params.type === RampType.BUY) {
      const handleOrderUrl = stringifyUrl(
        {
          url: baseUrl,
          query: {
            apiKey: appId,
            productsAvailed: type,
            fiatAmount: amount,
            fiatCurrency: fiat,
            countryCode: country,
            network: network,
            cryptoCurrencyCode: crypto,
            walletAddress: address,
            email: email,
            partnerOrderId: orderId,
            redirectURL: withdrawUrl,
          },
        },
        { encode: true },
      );
      return { orderId, url: handleOrderUrl };
    }
    // TODO sell
    return { orderId, url: '' };
  }
}

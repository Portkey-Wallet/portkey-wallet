import { request } from '@portkey-wallet/api/api-did';
import { IRampProviderType, RAMP_SOCKET_TIMEOUT, SELL_ORDER_DISPLAY_STATUS } from './constants';
import { AlchemyPayProvider, RampProvider, TransakProvider } from './provider';
import { AlchemyPayRampService, RampService } from './service';
import {
  IBaseRampOptions,
  IRampProviderMap,
  IRampSignalr,
  IRampService,
  IRequestConfig,
  IRampProvider,
  IGenerateTransaction,
  IOrderInfo,
  IClientType,
} from './types';
import { RampSignalr } from './signalr';
import { randomId } from '@portkey-wallet/utils';

export interface IBaseRamp {
  // config: IRampConfig;
  service: IRampService;
  rampSignalr: IRampSignalr;
  providerMap: IRampProviderMap;
  setProvider(provider: IRampProvider): void;
  getProvider(name: IRampProviderType): RampProvider | undefined;
  removeProvider(name: IRampProviderType): RampProvider | undefined;
  transferCrypto(orderId: string, generateTransaction: IGenerateTransaction): Promise<IOrderInfo>;
}

export abstract class BaseRamp implements IBaseRamp {
  // public config: IRampConfig;
  public service: IRampService;
  public rampSignalr: IRampSignalr;
  public providerMap: IRampProviderMap;

  constructor(options: IBaseRampOptions) {
    // this.config = new RampConfig({
    //   requestConfig: {
    //     baseUrl: 'http://192.168.11.180:3000',
    //     clientType: 'Extension',
    //   },
    // });
    this.service = new RampService({
      request: options.request,
      baseUrl: options?.baseUrl || '',
      clientType: options?.clientType || 'Android',
    });

    this.rampSignalr = new RampSignalr();
    this.providerMap = {};
  }

  public setProvider(provider: IRampProvider) {
    this.providerMap[provider.providerInfo.key] = provider;
  }

  public getProvider(key: IRampProviderType) {
    return this.providerMap[key];
  }

  public removeProvider(key: IRampProviderType) {
    const provider = this.providerMap[key];
    delete this.providerMap[key];
    return provider;
  }

  public clearProvider() {
    this.providerMap = {};
  }

  async transferCrypto(orderId: string, generateTransaction: IGenerateTransaction): Promise<IOrderInfo> {
    const clientId = randomId();
    try {
      await this.rampSignalr.doOpen({
        url: `${this.service.baseUrl}/ca`,
        clientId,
      });
    } catch (error) {
      //
    }

    let timer: NodeJS.Timeout | undefined | number = undefined;
    const timerPromise = new Promise<'timeout'>(resolve => {
      timer = setTimeout(() => {
        resolve('timeout');
      }, RAMP_SOCKET_TIMEOUT);
    });

    let signalFinishPromiseResolve: (value: IOrderInfo | PromiseLike<IOrderInfo | null> | null) => void;
    const signalFinishPromise = new Promise<IOrderInfo | null>(resolve => {
      signalFinishPromiseResolve = resolve;
    });

    let isTransferred = false;
    const { remove: removeAchTx } = this.rampSignalr.onRampOrderChanged(async data => {
      if (data.displayStatus === SELL_ORDER_DISPLAY_STATUS.TRANSFERRED) {
        signalFinishPromiseResolve(data);
        return;
      }

      if (data.displayStatus !== SELL_ORDER_DISPLAY_STATUS.CREATED) {
        return;
      }

      try {
        const result = await generateTransaction(data);
        await this.service.sendSellTransaction({
          merchantName: data.merchantName,
          orderId,
          rawTransaction: result.rawTransaction,
          signature: result.signature,
          publicKey: result.publicKey,
        });
        isTransferred = true;
      } catch (e) {
        signalFinishPromiseResolve(null);
        return;
      }
    });

    await this.rampSignalr.requestRampOrderStatus(clientId, orderId);
    const signalrSellResult = await Promise.race([timerPromise, signalFinishPromise]);

    removeAchTx();
    this.rampSignalr.stop();
    if (timer) {
      clearTimeout(timer);
      timer = undefined;
    }

    if (signalrSellResult === null) throw new Error('Transaction failed.');
    if (signalrSellResult === 'timeout') {
      if (!isTransferred) throw new Error('Transaction failed.');
      throw {
        code: 'TIMEOUT',
        message: 'The waiting time is too long, it will be put on hold in the background.',
      };
    }
    return signalrSellResult;
  }
}

export class Ramp extends BaseRamp {
  public request: any;
  public baseUrl: string;
  public clientType: IClientType;

  constructor(options: IBaseRampOptions) {
    super(options);

    this.request = options.request;
    this.baseUrl = options.baseUrl || '';
    this.clientType = options.clientType || 'Android';
  }

  async init(requestOptions: IRequestConfig) {
    this.setRequestOptions(requestOptions);
    await this.refreshRampProvider();
  }

  setRequestOptions(options: IRequestConfig) {
    this.baseUrl = options.baseUrl;
    this.clientType = options.clientType;

    this.service.setRequestOptions(options);
  }

  async refreshRampProvider() {
    const {
      data: { thirdPart },
    } = await this.service.getRampInfo();

    this.clearProvider();

    Object.keys(thirdPart).forEach(key => {
      switch (key) {
        case IRampProviderType.AlchemyPay:
          this.setProvider(
            new AlchemyPayProvider({
              providerInfo: {
                key: IRampProviderType.AlchemyPay,
                ...thirdPart[IRampProviderType.AlchemyPay],
              },
              service: new AlchemyPayRampService({
                request: this.request,
                baseUrl: this.baseUrl,
                clientType: this.clientType,
              }),
            }),
          );
          break;

        case IRampProviderType.Transak:
          this.setProvider(
            new TransakProvider({
              providerInfo: { key: IRampProviderType.Transak, ...thirdPart[IRampProviderType.Transak] },
              service: new RampService({
                request: this.request,
                baseUrl: this.baseUrl,
                clientType: this.clientType,
              }),
            }),
          );
          break;

        default:
          break;
      }
    });
  }
}

const ramp = new Ramp({ request: request });

export default ramp;

export * from './api';
export * from './constants';
export * from './service';
export * from './provider';
export * from './types';

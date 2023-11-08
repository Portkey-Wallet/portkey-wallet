import { request } from '@portkey-wallet/api/api-did';
import { RampConfig } from './config';
import { IRampProviderType, RAMP_SOCKET_TIMEOUT } from './constants';
import { AlchemyPayProvider, RampProvider, TransakProvider } from './provider';
import { AlchemyPayRampService, RampService } from './service';
import {
  IBaseRampOptions,
  IRampConfig,
  IRampProviderMap,
  IRampSignalr,
  IRampService,
  IRequestConfig,
  IRampProvider,
  IGenerateTransaction,
  IOrderInfo,
} from './types';
import { RampSignalr } from './signalr';
import { randomId } from '@portkey-wallet/utils';

export interface IBaseRamp {
  config: IRampConfig;
  service: IRampService;
  rampSignalr: IRampSignalr;
  providerMap: IRampProviderMap;
  setProvider(provider: IRampProvider): void;
  getProvider(name: IRampProviderType): RampProvider | undefined;
  removeProvider(name: IRampProviderType): RampProvider | undefined;
  transferCrypto(orderId: string, generateTransaction: IGenerateTransaction): Promise<IOrderInfo>;
}

export abstract class BaseRamp implements IBaseRamp {
  public config: IRampConfig;
  public service: IRampService;
  public rampSignalr: IRampSignalr;
  public providerMap: IRampProviderMap;

  constructor(options: IBaseRampOptions) {
    this.config = new RampConfig({
      requestConfig: {
        baseUrl: '',
        clientType: 'Android',
      },
    });
    this.service = new RampService({ request: options.request, ...this.config.requestConfig });

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

  async transferCrypto(orderId: string, generateTransaction: IGenerateTransaction): Promise<IOrderInfo> {
    const clientId = randomId();
    try {
      await this.rampSignalr.doOpen({
        url: `${this.config.requestConfig.baseUrl}/ca`,
        clientId,
      });
    } catch (error) {
      //
    }

    let timer: NodeJS.Timeout | undefined = undefined;
    const timerPromise = new Promise<'timeout'>(resolve => {
      timer = setTimeout(() => {
        resolve('timeout');
      }, RAMP_SOCKET_TIMEOUT);
    });

    // const signalrSellPromise = new Promise<IOrderInfo>(resolve => {
    //   const { remove: removeAchTx } = this.rampSignalr.onRampOrderChanged(async data => {
    //     if (data === null) {
    //       throw new Error('Transaction failed.');
    //     }

    //     try {
    //       status.current = STAGE.TRANSACTION;
    //       const result = await paymentSellTransfer(data);
    //       await request.payment.sendSellTransaction({
    //         params: {
    //           merchantName: ACH_MERCHANT_NAME,
    //           orderId,
    //           rawTransaction: result.rawTransaction,
    //           signature: result.signature,
    //           publicKey: result.publicKey,
    //         },
    //       });
    //     } catch (e) {
    //       resolve(null);
    //       return;
    //     }

    //     const { remove: removeRes } = signalrSell.onRequestOrderTransferred({ clientId, orderId }, async data => {
    //       status.current = STAGE.ORDER;
    //       resolve(data);
    //     });
    //     signalrOrderRemove = removeRes;
    //     signalrSell.requestOrderTransferred(clientId, orderId);
    //   });
    //   signalrAchTxRemove = removeAchTx;
    //   signalrSell.requestAchTxAddress(clientId, orderId);
    // });

    return {} as any;
  }
}

export class Ramp extends BaseRamp {
  public request: any;

  constructor(options: IBaseRampOptions) {
    super(options);

    this.request = options.request;
  }

  async init(requestConfig: IRequestConfig) {
    this.config.setRequestConfig(requestConfig);

    await this.refreshRampProvider();
  }

  async refreshRampProvider() {
    const {
      data: { thirdPart },
    } = await this.service.getRampInfo();

    Object.keys(thirdPart).forEach(key => {
      switch (key) {
        case IRampProviderType.AlchemyPay:
          this.setProvider(
            new AlchemyPayProvider({
              providerInfo: { key: IRampProviderType.AlchemyPay, ...thirdPart.AlchemyPay },
              service: new AlchemyPayRampService({ request: this.request, ...this.config.requestConfig }),
            }),
          );
          break;

        case IRampProviderType.Transak:
          this.setProvider(
            new TransakProvider({
              providerInfo: { key: IRampProviderType.Transak, ...thirdPart.AlchemyPay },
              service: new RampService({ request: this.request, ...this.config.requestConfig }),
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

import { RampConfig } from './config';
import { IRampProviderType, InitRampProvidersInfo } from './constants';
import AlchemyProvider, { RampProvider, TransakProvider } from './provider';
import { AlchemyRampService, RampSellSocket, RampService, TransakRampService } from './service';
import { IRampConfig, IRampProviderMap, IRampSellSocket, IRampService, IRequestConfig } from './types';

export interface IBaseRamp {
  config: IRampConfig;
  service: IRampService;
  sellSocket: IRampSellSocket;
  providerMap: IRampProviderMap;
  setProvider: (provider: RampProvider) => void;
  getProvider: (name: IRampProviderType) => RampProvider | undefined;
  updateProvider: (name: IRampProviderType, provider: RampProvider) => void;
}

export abstract class BaseRamp implements IBaseRamp {
  public config: IRampConfig;
  public service: IRampService;
  public sellSocket: IRampSellSocket;
  public providerMap: IRampProviderMap;

  constructor() {
    this.config = new RampConfig({
      requestConfig: {
        baseUrl: '',
        clientType: 'Android',
      },
    });
    this.service = new RampService(this.config.requestConfig);
    this.sellSocket = {};
    this.providerMap = InitRampProvidersInfo;
  }

  public setProvider(provider: RampProvider) {
    this.providerMap[provider.providerInfo.key] = provider;
  }

  public getProvider(key: IRampProviderType) {
    return this.providerMap[key];
  }

  public updateProvider(key: IRampProviderType, provider: RampProvider) {
    this.providerMap[key] = provider;
  }
}

export class Ramp extends BaseRamp {
  public config: IRampConfig;
  public service: IRampService;
  public sellSocket: IRampSellSocket;
  public providerMap: IRampProviderMap;

  constructor() {
    super();
    this.config = new RampConfig({
      requestConfig: {
        baseUrl: '',
        clientType: 'Android',
      },
    });
    this.service = new RampService(this.config.requestConfig);
    this.sellSocket = {}; // TODO
    this.providerMap = {};
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
        case IRampProviderType.Alchemy:
          this.setProvider(
            new AlchemyProvider({
              providerInfo: { key: IRampProviderType.Alchemy, ...thirdPart.Alchemy },
              service: new AlchemyRampService(this.config.requestConfig),
              sellSocket: new RampSellSocket(),
            }),
          );
          break;

        case IRampProviderType.Transak:
          this.setProvider(
            new TransakProvider({
              providerInfo: { key: IRampProviderType.Transak, ...thirdPart.Alchemy },
              service: new TransakRampService(this.config.requestConfig),
              sellSocket: new RampSellSocket(),
            }),
          );
          break;

        default:
          break;
      }
    });
  }
}

const ramp = new Ramp();

export default ramp;

export * from './api';
export * from './constants';
export * from './service';
export * from './provider';
export * from './types';

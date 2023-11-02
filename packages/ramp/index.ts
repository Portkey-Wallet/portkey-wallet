import { RampConfig } from './config';
import { IRampProviderType, InitRampProvidersInfo, RampType } from './constants';
import { RampService } from './service';
import { IRampConfig, IRampProvider, IRampProviderMap, IRampService, IRequestConfig } from './types';
import { IRampProviderInfo } from './types/provider';

export interface IBaseRamp {
  config: IRampConfig;
  service: IRampService;
  providerMap: IRampProviderMap;
  setProvider: (provider: RampProvider) => void;
  getProvider: (name: IRampProviderType) => RampProvider | undefined;
  updateProvider: (name: IRampProviderType, provider: RampProvider) => void;
}

export abstract class BaseRamp implements IBaseRamp {
  public config: IRampConfig;
  public service: IRampService;

  public providerMap: IRampProviderMap;

  constructor() {
    this.config = new RampConfig({
      requestConfig: {
        baseUrl: '',
        clientType: 'Android',
      },
    });
    this.service = new RampService(this.config.requestConfig);

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
            new AlchemyProvider({ providerInfo: { key: IRampProviderType.Alchemy, ...thirdPart.Alchemy } }),
          );
          break;

        case IRampProviderType.Transak:
          this.setProvider(
            new TransakProvider({ providerInfo: { key: IRampProviderType.Transak, ...thirdPart.Alchemy } }),
          );
          break;

        default:
          break;
      }
    });
  }
}

export abstract class RampProvider {
  public providerInfo: IRampProviderInfo;

  constructor(options: IRampProvider) {
    this.providerInfo = options.providerInfo;
  }

  // for go to pay
  abstract generateUrl(type: RampType): void;
}

export class AlchemyProvider extends RampProvider {
  public providerInfo: IRampProviderInfo;

  constructor(options: IRampProvider) {
    super(options);
    this.providerInfo = options.providerInfo;
  }

  generateUrl(type: RampType) {
    // TODO
    if (type === RampType.BUY) {
      return '';
    }
    return '';
  }
}

export class TransakProvider extends RampProvider {
  public providerInfo: IRampProviderInfo;

  constructor(options: IRampProvider) {
    super(options);
    this.providerInfo = options.providerInfo;
  }

  generateUrl(type: RampType) {
    // TODO
    if (type === RampType.BUY) {
      return '';
    }
    return '';
  }
}

const ramp = new Ramp();

export default ramp;

export * from './api';
export * from './constants';
export * from './service';
export * from './types';

import { HTTPHeaders, HTTPMethod, IRequestDefaults } from '@portkey/types';

export interface IConfig {
  requestDefaults?: IRequestDefaults;
}

export interface IIMConfig extends IConfig {
  setConfig(options: IConfig): void;
}

export class RequestDefaultsConfig {
  public headers?: HTTPHeaders;
  public baseURL?: string;
  public url?: string;
  public method?: HTTPMethod;
  public timeout?: number;
  constructor(config?: IRequestDefaults) {
    if (config) {
      Object.entries(config).forEach(([key, value]) => {
        this[key as keyof IRequestDefaults] = value;
      });
    }
  }
  setConfig(config?: IRequestDefaults) {
    if (config) {
      Object.entries(config).forEach(([key, value]) => {
        this[key as keyof IRequestDefaults] = value;
      });
    }
  }
}

export class IMConfig implements IIMConfig {
  public requestDefaults?: IRequestDefaults;
  public requestConfig: RequestDefaultsConfig;

  constructor(options?: IConfig) {
    this.requestConfig = new RequestDefaultsConfig();
    if (options) this.setConfig(options);
  }
  setConfig(options: IConfig) {
    Object.entries(options).forEach(([key, value]) => {
      if (!value) return;
      switch (key) {
        case 'requestDefaults':
          this.requestConfig.setConfig(value);
          this.requestDefaults = value;
          break;
        default:
          this[key as keyof IConfig] = value;
          break;
      }
    });
  }
}

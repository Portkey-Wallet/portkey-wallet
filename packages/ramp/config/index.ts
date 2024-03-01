import { IRampConfig, IRampConfigOptions, IRequestConfig } from '../types';

export class RampConfig implements IRampConfig {
  public requestConfig: IRequestConfig;

  constructor(options: IRampConfigOptions) {
    this.requestConfig = options.requestConfig;
  }

  setRequestConfig(config: IRequestConfig) {
    this.requestConfig = config;
  }
}

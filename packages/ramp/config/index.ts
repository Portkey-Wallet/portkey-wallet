import { IRampConfig, IRampRequestConfig } from '../types';

export class RampConfig implements IRampConfig {
  public baseUrl: string;

  constructor(options?: IRampRequestConfig) {
    if (options) this.setConfig(options);
  }

  setConfig(options: IRampRequestConfig) {
    this.baseUrl = options.baseUrl;
  }
}

import { IRampConfig, IRampRequestConfig } from '../types';

export class RampConfig implements IRampConfig {
  public baseUrl: string;

  constructor(options?: IRampRequestConfig) {
    this.baseUrl = options?.baseUrl || '';
  }

  setConfig(options: IRampRequestConfig) {
    this.baseUrl = options?.baseUrl || '';
  }
}

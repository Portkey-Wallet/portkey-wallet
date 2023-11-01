import { IClientType, IRampConfig, IRampRequestConfig } from '../types';

export class RampConfig implements IRampConfig {
  public baseUrl: string;
  public clientType: IClientType;

  constructor(options?: IRampRequestConfig) {
    this.baseUrl = options?.baseUrl || '';
    this.clientType = options?.clientType || 'iOS';
  }

  setBaseUrl(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  setClientType(clientType: IClientType) {
    this.clientType = clientType;
  }
}

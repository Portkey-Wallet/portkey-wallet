export type IClientType = 'Android' | 'iOS' | 'Extension';

export interface IRequestConfig {
  baseUrl: string;
  clientType: IClientType;
}

export interface IRampConfigOptions {
  requestConfig: IRequestConfig;
}

export interface IRampConfig {
  requestConfig: IRequestConfig;
  setRequestConfig(config: IRequestConfig): void;
}

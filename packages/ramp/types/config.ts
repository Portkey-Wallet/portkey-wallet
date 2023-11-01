export type IClientType = 'Android' | 'iOS' | 'Extension';

export interface IRampRequestConfig {
  baseUrl?: string;
  clientType?: IClientType;
}

export interface IRampConfig extends IRampRequestConfig {
  setBaseUrl(baseUrl: string): void;
  setClientType(clientType: IClientType): void;
}

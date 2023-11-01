export interface IRampRequestConfig {
  baseUrl?: string;
}

export interface IRampConfig extends IRampRequestConfig {
  setConfig(options: IRampRequestConfig): void;
}

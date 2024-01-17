import { BaseConfig, RequestConfig } from '@portkey-wallet/api/types';

export interface IRampRequest {
  send: IRampRequestSend;
}

export type IRampRequestSend = (base: BaseConfig, config?: RequestConfig, reCount?: number) => Promise<any>;

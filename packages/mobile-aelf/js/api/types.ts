import { NetworkType } from '@portkey-wallet/types';
import { AxiosRequestConfig, AxiosResponse } from 'axios';

export type RequestConfig = {
  query?: string; //this for url parameter； example: test/:id
  networkType?: NetworkType;
} & AxiosRequestConfig;

export type IBaseRequest = {
  url: string;
} & RequestConfig;

export type BaseConfig = string | { target: string; baseConfig: RequestConfig };

export type UrlObj = { [key: string]: BaseConfig };

export type API_REQ_FUNCTION = (config?: RequestConfig) => Promise<any | AxiosResponse<any>>;

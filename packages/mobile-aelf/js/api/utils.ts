import axios from 'axios';
import { BaseConfig, RequestConfig } from './types';
import { DEFAULT_FETCH_TIMEOUT } from '@portkey-wallet/constants/misc';

const axiosInstance = axios.create({
  baseURL: '/',
  timeout: DEFAULT_FETCH_TIMEOUT,
});

axiosInstance.defaults.headers.common['x-csrf-token'] = 'AUTH_TOKEN';

axiosInstance.interceptors.request.use(
  config => {
    return config;
  },
  error => {
    Promise.reject(error);
  },
);

axiosInstance.interceptors.response.use(
  response => {
    const res = response.data;
    return res;
  },
  error => {
    let _error = error?.response?.data?.error || error;
    if (typeof _error === 'string') {
      _error = { message: _error };
    }
    if (_error.details) _error.message = _error.details;
    return Promise.reject(_error);
  },
);

export const service = axiosInstance;

export function spliceUrl(baseUrl: string, extendArg?: string) {
  return extendArg ? baseUrl + '/' + extendArg : baseUrl;
}

export function getRequestConfig(base: BaseConfig, config?: RequestConfig) {
  if (typeof base === 'string') {
    return config;
  } else {
    const { baseConfig } = base || {};
    const { query, method, params, data } = config || {};
    return {
      ...baseConfig,
      ...config,
      query: (baseConfig.query || '') + (query || ''),
      method: method ? method : baseConfig.method,
      params: Object.assign({}, baseConfig.params, params),
      data: Object.assign({}, baseConfig.data, data),
      headers: {
        ...baseConfig.headers,
        ...config?.headers,
      },
    };
  }
}

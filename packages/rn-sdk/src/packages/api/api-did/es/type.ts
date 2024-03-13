import { CustomFetchConfig } from 'packages/utils/fetch';
import { BaseConfig, RequestConfig } from '../../types';

export interface ESConfig extends CustomFetchConfig {
  params?: {
    filter?: string;
    sort?: string;
    sortType?: 0 | 1;
    skipCount?: number;
    maxResultCount?: number;
  };
}

export type ESBaseConfig = BaseConfig & {
  config: ESConfig;
};

export type ES_API_REQ_FUNCTION = (config?: RequestConfig & ESConfig) => Promise<{ type: 'timeout' } | any>;

export interface IGetContactListParams {
  page: number;
  size: number;
  modificationTime: string;
  keyword?: string;
}

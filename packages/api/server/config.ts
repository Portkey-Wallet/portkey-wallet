import { customFetch } from '@portkey-wallet/utils/fetch';
import { BaseConfig, RequestConfig, UrlObj } from '../types';
import { getRequestConfig, spliceUrl } from '../utils';
import EventEmitter from 'events';
import merge from 'lodash/merge';

export class ServiceInit extends EventEmitter {
  [x: string]: any;
  /**
   * @method parseRouter
   * @param  {string} name
   * @param  {UrlObj} urlObj
   */
  public defaultConfig: RequestConfig;

  constructor() {
    super();
    this.defaultConfig = {};
  }

  parseRouter = (name: string, urlObj: UrlObj) => {
    const obj: any = (this[name] = {});
    Object.keys(urlObj).forEach(key => {
      obj[key] = this.send.bind(this, urlObj[key] as any);
    });
  };
  /**
   * @method send
   * @param  {RequestConfig} config
   * @return {Promise<any>}
   */

  send = (base: BaseConfig, config?: RequestConfig) => {
    const { method = 'POST', url, baseURL, ...fetchConfig } = getRequestConfig(base, config, this.defaultConfig) || {};
    const _url = url || (typeof base === 'string' ? base : base.target);
    const URL = spliceUrl(baseURL || '', _url);
    return customFetch(URL, {
      ...fetchConfig,
      method,
    });
  };

  setDefaultConfig(defaultConfig: RequestConfig) {
    this.defaultConfig = defaultConfig;
  }

  set(key: keyof RequestConfig, value: any) {
    if (typeof value === 'object' && this.defaultConfig[key]) {
      this.defaultConfig[key] = merge(this.defaultConfig[key] || {}, value);
    } else {
      this.defaultConfig[key] = value;
    }
  }
}

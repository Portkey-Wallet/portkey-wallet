import { DEFAULT_METHOD } from 'api/list';
import { BaseConfig, UrlObj, RequestConfig } from 'api/types';
import { spliceUrl, service, getRequestConfig } from 'api/utils';
import { NETWORK_CONFIG } from 'api/wallet';

// eslint-disable-next-line no-new-func
const myServer = new Function();

/**
 * @method parseRouter
 * @param  {string} name
 * @param  {UrlObj} urlObj
 */
myServer.prototype.parseRouter = function (name: string, urlObj: UrlObj) {
  const obj: any = (this[name] = {});
  Object.keys(urlObj).forEach(key => {
    obj[key] = this.send.bind(this, urlObj[key]);
  });
};

/**
 * @method send
 * @param  {BaseConfig} base
 * @param  {object} config
 * @return {Promise<any>}
 */
myServer.prototype.send = function (base: BaseConfig, config: RequestConfig) {
  const {
    method = DEFAULT_METHOD,
    query = '',
    networkType,
    url,
    baseURL,
    ...axiosConfig
  } = getRequestConfig(base, config) || {};
  return service({
    ...axiosConfig,
    url: url || spliceUrl(typeof base === 'string' ? base : base.target, query),
    method,
    baseURL: baseURL || (networkType ? NETWORK_CONFIG[networkType].url : undefined),
  });
};

export default myServer.prototype;

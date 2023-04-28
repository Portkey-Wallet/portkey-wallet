import { ServiceInit } from '../server/config';
import { customFetch } from '@portkey-wallet/utils/fetch';
import { BaseConfig, RequestConfig } from '../types';
import { getRequestConfig, spliceUrl } from '../utils';
import { isValidRefreshTokenConfig, queryAuthorization, RefreshTokenConfig } from './utils/index';
import { sleep } from '@portkey-wallet/utils';
export class DidService extends ServiceInit {
  protected refreshTokenConfig?: RefreshTokenConfig;
  protected onLockApp?: (expired?: boolean) => void;
  locked?: boolean;
  constructor() {
    super();
  }
  getConnectToken = async () => {
    if (this.locked) {
      await sleep(1000);
      return 'locked';
    }
    this.locked = true;
    try {
      if (!this.refreshTokenConfig || !isValidRefreshTokenConfig(this.refreshTokenConfig)) return;
      const authorization = await queryAuthorization(this.refreshTokenConfig);
      this.defaultConfig.headers = { ...this.defaultConfig.headers, Authorization: authorization };
      this.locked = false;
      return authorization;
    } catch (error) {
      this.locked = false;
      console.log(error, '====error-getConnectToken');
      return;
    }
  };

  initService = () => {
    this.refreshTokenConfig = undefined;
    this.defaultConfig.headers = {
      ...this.defaultConfig.headers,
      Authorization: '',
    };
  };

  setRefreshTokenConfig = (config: RefreshTokenConfig) => {
    // make sure clean Authorization
    if (this.refreshTokenConfig?.ca_hash !== config.ca_hash) {
      this.defaultConfig.headers = {
        ...this.defaultConfig.headers,
        Authorization: '',
      };
    }
    this.refreshTokenConfig = config;
  };
  send = async (base: BaseConfig, config?: RequestConfig, reCount = 0): Promise<any> => {
    const { method = 'POST', url, baseURL, ...fetchConfig } = getRequestConfig(base, config, this.defaultConfig) || {};
    const _url = url || (typeof base === 'string' ? base : base.target);
    const URL = spliceUrl(baseURL || '', _url);
    const fetchResult = await customFetch(URL, {
      ...fetchConfig,
      method,
    });
    if (fetchResult && fetchResult.status === 401 && fetchResult.message === 'unauthorized') {
      if (!this.refreshTokenConfig) throw fetchResult;
      if (reCount > 5) throw fetchResult;
      const token = await this.getConnectToken();
      if (!token) {
        if (this.refreshTokenConfig && !isValidRefreshTokenConfig(this.refreshTokenConfig)) {
          this.onLockApp?.(true);
          // TODO: definite message
          throw { ...fetchResult, code: 402, message: 'token expires' };
        }
        throw fetchResult;
      }
      return this.send(base, config, ++reCount);
    }
    return fetchResult;
  };
  setLockCallBack = (callBack: (expired?: boolean) => void) => {
    this.onLockApp = callBack;
  };
}

export default new DidService();

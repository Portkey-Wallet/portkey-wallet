import { ServiceInit } from '../server/config';
import { customFetch } from '@portkey-wallet/utils/fetch';
import { IExceptionManager, Severity } from '@portkey-wallet/utils/ExceptionManager';
import { BaseConfig, RequestConfig } from '../types';
import { getRequestConfig, spliceUrl } from '../utils';
import { isValidRefreshTokenConfig, queryAuthorization, RefreshTokenConfig } from './utils/index';
import { sleep } from '@portkey-wallet/utils';
import im from '@portkey-wallet/im';
import { IM_TOKEN_ERROR_ARRAY } from '@portkey-wallet/im/constant';
import signalrFCM from '@portkey-wallet/socket/socket-fcm';

const C_T_EVENT_NAME = 'connectTokenChange';
export class DidService extends ServiceInit {
  protected refreshTokenConfig?: RefreshTokenConfig;
  protected onLockApp?: (expired?: boolean) => void;
  locked?: boolean;
  exceptionManager?: IExceptionManager;
  private transformCallbackList: ((result: any) => any)[] = [];
  constructor() {
    super();
  }

  send = async (base: BaseConfig, config?: RequestConfig, reCount = 0): Promise<any> => {
    console.log('send=== base', base, 'config', config, 'reCount', reCount);

    try {
      const noTransform = typeof base !== 'string' ? base?.config?.extra?.noTransform : undefined;
      const result = await this.sendOrigin(base, config, reCount);
      if (this.transformCallbackList.length > 0 && !noTransform) {
        const i = this.transformCallbackList.reduce((prevResult, callback) => {
          return callback(prevResult);
        }, result);
        return i;
      }
      return result;
    } catch (errResult: any) {
      const { URL, fetchConfig } = this.getConfig(base, config);
      this.errorReport(URL, fetchConfig, errResult);
      throw errResult;
    }
  };

  getConfig = (base: BaseConfig, config?: RequestConfig) => {
    const { method = 'POST', url, baseURL, ...fetchConfig } = getRequestConfig(base, config, this.defaultConfig) || {};
    const _url = url || (typeof base === 'string' ? base : base.target);
    const URL = spliceUrl(baseURL || '', _url);
    return {
      URL,
      method,
      fetchConfig,
    };
  };
  sendOrigin = async (base: BaseConfig, config?: RequestConfig, reCount = 0): Promise<any> => {
    const { URL, fetchConfig, method } = this.getConfig(base, config);
    const fetchResult = await customFetch(URL, {
      ...fetchConfig,
      method,
    });
    return fetchResult;
  };
  setLockCallBack = (callBack: (expired?: boolean) => void) => {
    this.onLockApp = callBack;
  };

  setExceptionManager = (exceptionManager: IExceptionManager) => {
    this.exceptionManager = exceptionManager;
  };

  addTransform = (callback: (result: any) => any) => {
    if (typeof callback !== 'function') {
      return;
    }
    if (!this.transformCallbackList) {
      this.transformCallbackList = [];
    }
    this.transformCallbackList.push(callback);
  };

  errorReport = (url: string, fetchConfig: any, fetchResult: any) => {
    this.exceptionManager?.reportErrorMessage?.(`${URL} request error`, Severity.Fatal, {
      req: {
        url,
        config: fetchConfig,
      },
      rep: fetchResult,
    });
  };
}

const didServer = new DidService();

export default didServer;

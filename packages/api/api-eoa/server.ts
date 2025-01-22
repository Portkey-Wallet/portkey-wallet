import { ServiceInit } from '../server/config';
import { customFetch } from '@portkey-wallet/utils/fetch';
import { IExceptionManager, Severity } from '@portkey-wallet/utils/ExceptionManager';
import { BaseConfig, RequestConfig } from '../types';
import { getRequestConfig, spliceUrl } from '../utils';

export class DidService extends ServiceInit {
  protected onLockApp?: (expired?: boolean) => void;
  locked?: boolean;
  exceptionManager?: IExceptionManager;
  constructor() {
    super();
  }

  send = async (base: BaseConfig, config?: RequestConfig): Promise<any> => {
    try {
      return await this.sendOrigin(base, config);
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

  sendOrigin = async (base: BaseConfig, config?: RequestConfig): Promise<any> => {
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

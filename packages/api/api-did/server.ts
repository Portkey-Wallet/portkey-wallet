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
import { IStorageSuite } from '@portkey/types';

const C_T_EVENT_NAME = 'connectTokenChange';
const C_T_STORAGE_KEY = 'DidServiceConnectTokenStorageKey';
export class DidService extends ServiceInit {
  protected refreshTokenConfig?: RefreshTokenConfig;
  protected onLockApp?: (expired?: boolean) => void;
  protected storage?: IStorageSuite;
  locked?: boolean;
  exceptionManager?: IExceptionManager;
  constructor() {
    super();
  }

  public emitConnectTokenChange = (authorization: string) => {
    this.emit(C_T_EVENT_NAME, authorization);
  };
  public onConnectTokenChange = (listener: (...args: any[]) => void) => {
    return this.on(C_T_EVENT_NAME, listener);
  };
  getConnectToken = async () => {
    if (this.locked) {
      await sleep(1000);
      return 'locked';
    }
    this.locked = true;
    try {
      if (!this.refreshTokenConfig || !isValidRefreshTokenConfig(this.refreshTokenConfig)) return;
      const authorization = await queryAuthorization(this.refreshTokenConfig);
      this.saveAuthorization(authorization);
      this.setAuthorization(authorization);
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
    this.storage?.removeItem(C_T_STORAGE_KEY);
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
    try {
      this.getConnectToken();
    } catch (error) {
      console.log(error);
    }
  };
  send = async (base: BaseConfig, config?: RequestConfig, reCount = 0): Promise<any> => {
    try {
      return await this.sendOrigin(base, config, reCount);
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
  handleConnectToken = async (fetchResult: any) => {
    const token = await this.getConnectToken();
    if (!token) {
      if (this.refreshTokenConfig && !isValidRefreshTokenConfig(this.refreshTokenConfig)) {
        this.onLockApp?.(true);
        // TODO: definite message
        throw { ...fetchResult, code: 402, message: 'token expires' };
      }
      throw fetchResult;
    }
  };
  sendOrigin = async (base: BaseConfig, config?: RequestConfig, reCount = 0): Promise<any> => {
    const { URL, fetchConfig, method } = this.getConfig(base, config);
    const fetchResult = await customFetch(URL, {
      ...fetchConfig,
      method,
    });
    if (fetchResult && fetchResult.status === 401 && fetchResult.message === 'unauthorized') {
      if (!this.refreshTokenConfig) throw fetchResult;
      if (reCount > 5) throw fetchResult;
      await this.handleConnectToken(fetchResult);
      return this.send(base, config, ++reCount);
    } else if (fetchResult && IM_TOKEN_ERROR_ARRAY.includes(fetchResult.code)) {
      await im.refreshToken();
      return this.send(base, config, ++reCount);
    }
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

  initStorageAuthorization = async () => {
    try {
      const authorization = await this.storage?.getItem(C_T_STORAGE_KEY);
      if (authorization) this.setAuthorization(authorization);
    } catch (error) {
      this.exceptionManager?.reportError(error, Severity.Fatal);
    }
  };
  setStorage = (storage: IStorageSuite) => {
    this.storage = storage;
    this.initStorageAuthorization();
  };
  setAuthorization = (authorization: string) => {
    this.set('headers', { Authorization: authorization });
    this.emitConnectTokenChange(authorization);
  };
  saveAuthorization = (authorization: string) => {
    this.storage?.setItem(C_T_STORAGE_KEY, authorization);
  };
}

const didServer = new DidService();

didServer.onConnectTokenChange(authorization => {
  im.config.setConfig({
    requestDefaults: {
      headers: {
        ...im.config.requestConfig?.headers,
        Authorization: authorization,
      },
    },
  });

  signalrFCM.setPortkeyToken(authorization);
});

export default didServer;

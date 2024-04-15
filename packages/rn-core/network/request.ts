import { DidService } from '@portkey-wallet/api/api-did/server';
import { IFetch, NetworkResult, TypedUrlParams } from './types';
import { NativeModules } from 'react-native';
import { stringify } from 'query-string';
interface NetworkOptions {
  maxWaitingTime: number;
}
interface ResultWrapper<T> {
  status: NetworkResult;
  result?: T;
  errCode: string;
  errMessage?: string;
}
interface NetworkModule {
  fetch: (
    url: string,
    method: 'GET' | 'POST' | 'PUT',
    params: TypedUrlParams,
    headers: TypedUrlParams,
    extraOptions: NetworkOptions,
  ) => Promise<string>;
}
const PortkeyModulesEntity = NativeModules.NetworkModule as NetworkModule;

const nativeFetch = async <T>(
  url: string,
  method: 'GET' | 'POST' | 'PUT',
  params?: TypedUrlParams,
  headers?: TypedUrlParams,
  extraOptions?: NetworkOptions,
): Promise<ResultWrapper<T>> => {
  console.log('invoke nativeFetch');
  // it is not recommended to use this fetch() method directly, so NetworkModule isn't declared in portkeyModulesEntity
  const networkModule = PortkeyModulesEntity;
  console.log('networkModule', Object.keys(networkModule));
  const res = await networkModule.fetch(
    url,
    method,
    params ?? {},
    headers ?? {},
    extraOptions ?? { maxWaitingTime: 10000 },
  );
  if (res?.length > 0) {
    try {
      const t = JSON.parse(res) as ResultWrapper<T>;
      if (t?.result && typeof t.result === 'string') {
        return JSON.parse(t.result);
      }
      if (t.errCode === '401') {
        return { message: 'unauthorized', status: 401 };
      }
      return t;
    } catch (e) {}
  }
  throw new Error('fetch failed');
};

class SDKFetch implements IFetch {
  fetch(
    url: string,
    method: 'GET' | 'POST' | 'PUT',
    params?: TypedUrlParams | undefined,
    headers?: TypedUrlParams | undefined,
    extraOptions?: { maxWaitingTime: number } | undefined,
  ): Promise<{
    status: NetworkResult;
    result?: any;
    code: string;
    message?: string | undefined;
  }> {
    return nativeFetch(url, method, params, headers, extraOptions);
  }
}

export class RNDidService extends DidService {
  private fetchInstance: IFetch;
  constructor() {
    super();
    this.fetchInstance = new SDKFetch();
  }
  protected async fetchData(URL: string, fetchConfig: any, method: string) {
    console.log('URLURLURL', URL, 'fetchConfig', fetchConfig);
    const requestConfig = {
      ...fetchConfig,
      url: URL,
    };
    const { url, params = {}, headers, resourceUrl, stringifyOptions } = requestConfig;
    let uri = url;
    // handle body & url & method
    let myBody;
    const _method = method.toUpperCase();
    if (_method === 'GET' || _method === 'DELETE') {
      uri = Object.keys(params).length > 0 ? `${uri}?${stringify(params, stringifyOptions)}` : uri;
      myBody = undefined;
    } else {
      console.log('URLURLURL', URL, 'requestConfig.params', typeof requestConfig.params);
      if (requestConfig.params) {
        myBody = typeof requestConfig.params === 'string' ? JSON.parse(requestConfig.params) : requestConfig.params;
      }
    }
    if (resourceUrl !== undefined) {
      uri += `/${resourceUrl}`;
    }
    // handle headers
    const defaultHeaders = {
      Accept: 'text/plain;v=1.0',
      'Content-Type': 'application/json',
    };
    const myHeaders: TypedUrlParams = {};
    Object.entries({ ...defaultHeaders, ...headers }).forEach(([headerItem, value]) => {
      myHeaders[headerItem] = value as string | number | boolean | null | undefined;
    });
    console.log('uri', uri, 'this.fetchInstance.fetch myBody', myBody);
    return await this.fetchInstance.fetch(uri, _method, myBody, myHeaders);
  }
}

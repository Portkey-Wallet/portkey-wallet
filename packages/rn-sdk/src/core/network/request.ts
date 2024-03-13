import { IFetch, NetworkResult, TypedUrlParams } from '@portkey-wallet/api/api-did/types';
import { NativeModules } from 'react-native';
interface NetworkOptions {
  maxWaitingTime: number;
}
interface ResultWrapper<T> {
  status: NetworkResult;
  result?: T;
  code: string;
  message?: string;
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
  // it is not recommended to use this fetch() method directly, so NetworkModule isn't declared in portkeyModulesEntity
  const networkModule = (PortkeyModulesEntity as any).NetworkModule as NetworkModule;
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
        t.result = JSON.parse(t.result);
      }
      return t;
    } catch (e) {}
  }
  throw new Error('fetch failed');
};

export class SDKFetch implements IFetch {
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

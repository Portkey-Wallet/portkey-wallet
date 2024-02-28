// import { BaseConfig, RequestConfig } from 'packages/api/types';
// import { NetworkController } from 'network/controller';
// import { IRampRequest } from '@portkey/ramp';

// class RnsdkRequest implements IRequest {
//   send = async (base: BaseConfig, config?: RequestConfig | undefined): Promise<any> => {
//     const url = await NetworkController.parseUrl(config?.url ?? '');
//     const method = (config?.method || 'GET') as 'GET' | 'POST';
//     const res = await NetworkController.realExecute(url, method, config?.params, config?.headers);
//     if (res?.result) {
//       return res.result;
//     }
//     return res;
//   };
// }

// export default new RnsdkService();
import { IFetch, NetworkResult, TypedUrlParams } from '@portkey-wallet/api/api-did/types';
import { NativeEventEmitter, NativeModules, Platform } from 'react-native';
// export type TypedUrlParams = { [x: string | symbol]: string | number | boolean | null | undefined };
export interface NetworkOptions {
  maxWaitingTime: number;
}
export interface ResultWrapper<T> {
  status: NetworkResult;
  result?: T;
  code: string;
  message?: string;
}

// export enum NetworkResult {
//   success = 1,
//   failed = -1,
// }
export interface NetworkModule {
  fetch: (
    url: string,
    method: 'GET' | 'POST' | 'PUT',
    params: TypedUrlParams,
    headers: TypedUrlParams,
    extraOptions: NetworkOptions,
  ) => Promise<string>;
}
export const PortkeyModulesEntity = NativeModules.NetworkModule as NetworkModule;

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
    //     return res;
    //   };
    // }
    // export default new RnsdkService();
    message?: string | undefined;
  }> {
    return nativeFetch(url, method, params, headers, extraOptions);
  }
}

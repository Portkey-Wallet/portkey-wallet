import { NativeEventEmitter, NativeModules } from 'react-native';
import { PortkeyEntries } from '../../config/entries';
import { AcceptableValueType } from '../../model/container/BaseContainer';

export const portkeyModulesEntity = NativeModules as PortkeyNativeModules;

export interface PortkeyNativeModules {
  RouterModule: RouterModule;
  NativeWrapperModule: NativeWrapperModule;
}

export interface RouterModule {
  navigateTo: (entry: PortkeyEntries, from: string, targetScene?: string) => void;
  navigateToWithOptions: <R, T = { [x: string]: AcceptableValueType }>(
    targetEntry: string,
    from: string,
    params: RouterOptions<T>,
    callback: (res: EntryResult<R>) => void,
  ) => void;
  navigateBack: <R>(from: string, result: EntryResult<R>) => void;
}

export interface EntryResult<R> {
  result: R;
  status: 'success' | 'fail' | 'cancel';
  extraMsg?: { [x: string]: any };
}

export interface RouterOptions<T> {
  closeCurrentScreen?: boolean;
  navigationAnimation?: 'none' | 'slide' | 'fade';
  navigationAnimationDuration?: number;
  targetScene?: string;
  params?: Partial<T>;
}

export type TypedUrlParams = { [x: string]: string | number | boolean | null | undefined };

export interface NativeWrapperModule {
  platformName: string;
  onError: (from: string, errMsg: string, data: { [x: string]: any }) => void;
  onFatalError: (from: string, errMsg: string, data: { [x: string]: any }) => void;
  onWarning: (from: string, warnMsg: string) => void;
  emitJSMethodResult: (eventId: string, result: string) => void;
}

export interface NetworkModule {
  fetch: (url: string, method: 'GET' | 'POST', params: TypedUrlParams, headers: TypedUrlParams) => Promise<string>;
}

export const nativeFetch = async <T>(
  url: string,
  method: 'GET' | 'POST',
  params?: TypedUrlParams,
  headers?: TypedUrlParams,
): Promise<ResultWrapper<T>> => {
  const networkModule = (portkeyModulesEntity as any).NetworkModule as NetworkModule;
  const res = await networkModule.fetch(url, method, params ?? {}, headers ?? {});
  if (res?.length > 0) {
    try {
      const t = JSON.parse(res) as ResultWrapper<T>;
      return t;
    } catch (e) {}
  }
  throw new Error('fetch failed');
};

export const PortkeyDeviceEventEmitter = new NativeEventEmitter(portkeyModulesEntity.NativeWrapperModule as any);

export interface ResultWrapper<T> {
  status: NetworkResult;
  result?: T;
  errCode: string;
}

export enum NetworkResult {
  success = 1,
  failed = -1,
}

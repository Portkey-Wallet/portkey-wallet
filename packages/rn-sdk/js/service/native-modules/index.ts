import { NativeModules } from 'react-native';
import { PortkeyEntries } from '../../config/entries';
import { AcceptableValueType } from '../../model/container/BaseContainer';

export const portkeyModulesEntity = NativeModules as PortkeyNativeModules;

export interface PortkeyNativeModules {
  RouterModule: RouterModule;
  NativeWrapperModule: NativeWrapperModule;
}

export interface RouterModule {
  navigateTo: (from: string, entry: PortkeyEntries, targetScene?: string) => void;
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

export interface NativeWrapperModule {
  onError: (from: string, errMsg: string, data: { [x: string]: any }) => void;
  onFatalError: (from: string, errMsg: string, data: { [x: string]: any }) => void;
  onWarning: (from: string, warnMsg: string) => void;
  getPlatformName: () => string;
  emitJSMethodResult: (eventId: string, result: string) => void;
}

export interface NetworkModule {
  fetch: (
    url: string,
    method: 'GET' | 'POST',
    params: { [x: string]: string | number | null | undefined },
  ) => Promise<string>;
}

export const nativeFetch = async <T>(
  url: string,
  method: 'GET' | 'POST',
  params: { [x: string]: string | number | null | undefined },
): Promise<ResultWrapper<T>> => {
  const networkModule = (portkeyModulesEntity as any).NetworkModule as NetworkModule;
  const res = await networkModule.fetch(url, method, params);
  if (res?.length > 0) {
    try {
      const t = JSON.parse(res) as ResultWrapper<T>;
      return t;
    } catch (e) {}
  }
  throw new Error('fetch failed');
};

export interface ResultWrapper<T> {
  status: NetworkResult;
  result?: T;
  errCode: string;
}

export enum NetworkResult {
  success = 1,
  failed = -1,
}

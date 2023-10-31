import { NativeEventEmitter, NativeModules, Platform } from 'react-native';
import { PortkeyEntries } from '../../config/entries';
import { AcceptableValueType } from '../../model/container/BaseContainer';

export const PortkeyModulesEntity = NativeModules as PortkeyNativeModules;

export interface PortkeyNativeModules {
  RouterModule: RouterModule;
  NativeWrapperModule: NativeWrapperModule;
  StorageModule: StorageModule;
  PermissionModule: PermissionModule;
}

export interface RouterModule {
  navigateTo: (entry: PortkeyEntries, from: string, targetScene: string, closeCurrentScreen: boolean) => void;
  navigateToWithOptions: <R, T = { [x: string]: AcceptableValueType }>(
    targetEntry: string,
    from: string,
    params: RouterOptions<T>,
    callback: (res: EntryResult<R>) => void,
  ) => void;
  navigateBack: <R>(result: EntryResult<R>) => void;
}

export interface EntryResult<R> {
  data?: R;
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

export type TypedUrlParams = { [x: string | symbol]: string | number | boolean | null | undefined };

export interface NetworkOptions {
  maxWaitingTime: number;
}

export interface NativeWrapperModule {
  platformName: string;
  tempStorageIdentifier: string;
  onError: (from: string, errMsg: string, data: { [x: string]: any }) => void;
  onFatalError: (from: string, errMsg: string, data: { [x: string]: any }) => void;
  onWarning: (from: string, warnMsg: string) => void;
  emitJSMethodResult: (eventId: string, result: string) => void;
}

export interface PermissionModule {
  isPermissionGranted: (permission: PermissionType) => Promise<boolean>;
  requestPermission: (permission: PermissionType) => Promise<boolean>;
}

export type PermissionType = 'camera' | 'photo' | 'location' | 'microphone' | 'storage';

export interface StorageModule {
  // set: (key: string, value: string | number | boolean | null | undefined) => void; // we can not control the type of value, so we use setString, setNumber, setBoolean instead
  setString: (key: string, value: string | null) => void;
  setBoolean: (key: string, value: boolean) => void;
  setNumber: (key: string, value: number) => void;
  getString: (key: string) => Promise<string | undefined>;
  getBoolean: (key: string) => Promise<boolean | undefined>;
  getNumber: (key: string) => Promise<number | undefined>;
}

export interface NetworkModule {
  fetch: (
    url: string,
    method: 'GET' | 'POST',
    params: TypedUrlParams,
    headers: TypedUrlParams,
    extraOptions: NetworkOptions,
  ) => Promise<string>;
}

export const nativeFetch = async <T>(
  url: string,
  method: 'GET' | 'POST',
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
    extraOptions ?? { maxWaitingTime: 5000 },
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

export const chooseImageAndroid = async (): Promise<string> => {
  if (Platform.OS !== 'android') {
    throw new Error("chooseImageAndroid only supports Android, use Expo's ImagePicker instead on iOS.");
  }
  return await (PortkeyModulesEntity.PermissionModule as any).chooseImage();
};

export const PortkeyDeviceEventEmitter = new NativeEventEmitter(PortkeyModulesEntity.NativeWrapperModule as any);

export interface ResultWrapper<T> {
  status: NetworkResult;
  result?: T;
  errCode: string;
  errMessage?: string;
}

export enum NetworkResult {
  success = 1,
  failed = -1,
}

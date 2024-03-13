import { NativeEventEmitter, NativeModules, Platform } from 'react-native';
import { AcceptableValueType } from '../../model/container/BaseContainer';

export const PortkeyModulesEntity = NativeModules as PortkeyNativeModules;

export interface PortkeyNativeModules {
  RouterModule: RouterModule;
  NativeWrapperModule: NativeWrapperModule;
  StorageModule: StorageModule;
  PermissionModule: PermissionModule;
  BiometricModule: BiometricModule;
}

export interface RouterModule {
  navigateTo: <T = { [x: string]: AcceptableValueType }>(
    targetEntry: string,
    launchMode: string,
    from: string,
    targetScene: string,
    closeCurrentScreen: boolean,
    params: Partial<T>,
  ) => void;
  navigateToWithOptions: <R, T = { [x: string]: AcceptableValueType }>(
    targetEntry: string,
    launchMode: string,
    from: string,
    params: RouterOptions<T>,
    callback: (res: EntryResult<R>) => void,
  ) => void;
  navigateBack: <R>(result: EntryResult<R>, from: string) => void;
}

export interface EntryResult<R> {
  data?: R;
  status: 'success' | 'fail' | 'cancel' | 'system'; // never use system status, only for system
  extraMsg?: { [x: string]: any };
  animated?: boolean;
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
  internalEncryptKey: string;
}

export interface NetworkModule {
  fetch: (
    url: string,
    method: 'GET' | 'POST' | 'PUT',
    params: TypedUrlParams,
    headers: TypedUrlParams,
    extraOptions: NetworkOptions,
  ) => Promise<string>;
}
export interface BiometricModule {
  bioAuthenticateAsync: (options: AuthenticationBioOptions) => Promise<AuthenticationBioResult>;
  isEnrolledAsync: () => Promise<boolean>;
}
export type AuthenticationBioOptions = {
  /**
   * A message that is shown alongside the TouchID or FaceID prompt.
   */
  promptMessage?: string;
  /**
   * Allows to customize the default `Cancel` label shown.
   */
  cancelLabel?: string;
  /**
   * After several failed attempts the system will fallback to the device passcode. This setting
   * allows you to disable this option and instead handle the fallback yourself. This can be
   * preferable in certain custom authentication workflows. This behaviour maps to using the iOS
   * Defaults to `false`.
   */
  disableDeviceFallback?: boolean;
  /**
   * Sets a hint to the system for whether to require user confirmation after authentication.
   * This may be ignored by the system if the user has disabled implicit authentication in Settings
   * or if it does not apply to a particular biometric modality. Defaults to `true`.
   * @platform android
   */
  requireConfirmation?: boolean;
  /**
   * Allows to customize the default `Use Passcode` label shown after several failed
   * authentication attempts. Setting this option to an empty string disables this button from
   * showing in the prompt.
   * @platform ios
   */
  fallbackLabel?: string;
};
export type AuthenticationBioResult = { success: true } | { success: false; error: string; warning?: string };
export const nativeFetch = async <T>(
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

import { NativeEventEmitter, NativeModules, Platform } from 'react-native';
type AcceptableValueType = boolean | string | number | Array<string | number> | null | undefined;

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

  reset: <T = { [x: string]: AcceptableValueType }>(
    targetEntry: string,
    from: string,
    targetScene: string,
    params: Partial<T>,
  ) => void;
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

// page entry name
export enum PortkeyEntries {
  TEST = 'test',

  // entry stage
  SIGN_IN_ENTRY = 'sign_in_entry',
  SIGN_UP_ENTRY = 'sign_up_entry',
  SELECT_COUNTRY_ENTRY = 'select_country_entry',
  GUARDIAN_APPROVAL_ENTRY = 'guardian_approval_entry',
  VERIFIER_DETAIL_ENTRY = 'verifier_detail_entry',

  // verify stage
  GUARDIAN_HOME_ENTRY = 'guardian_home_entry',
  GUARDIAN_DETAIL_ENTRY = 'guardian_detail_entry',
  ADD_GUARDIAN_ENTRY = 'add_guardian_entry',
  MODIFY_GUARDIAN_ENTRY = 'modify_guardian_entry',

  // pin stage
  CHECK_PIN = 'check_pin_entry',
  SET_PIN = 'set_pin_entry',
  CONFIRM_PIN = 'confirm_pin_entry',
  SET_BIO = 'set_bio_entry',
  SECURITY_LOCK_ENTRY = 'security_lock_entry',

  // account setting
  ACCOUNT_SETTING_ENTRY = 'account_setting_entry',
  BIOMETRIC_SWITCH_ENTRY = 'biometric_switch_entry',

  // tools and general settings
  SCAN_QR_CODE = 'scan_qr_code_entry',
  SCAN_LOG_IN = 'scan_log_in_entry',
  VIEW_ON_WEBVIEW = 'view_on_webview',

  // base assets service
  ASSETS_HOME_ENTRY = 'assets_home_entry',
  RECEIVE_TOKEN_ENTRY = 'receive_token_entry',

  // assets module ① : activity page
  ACTIVITY_LIST_ENTRY = 'activity_list_entry',
  ACTIVITY_DETAIL_ENTRY = 'activity_detail_entry',

  // assets module ② : token and nft details
  TOKEN_DETAIL_ENTRY = 'token_detail_entry',
  NFT_DETAIL_ENTRY = 'nft_detail_entry',

  // assets module ③ : add token
  TOKEN_MANAGE_LIST_ENTRY = 'token_manage_list_entry',
  TOKEN_MANAGE_ADD_ENTRY = 'token_manage_add_entry',

  // send token service
  SEND_TOKEN_HOME_ENTRY = 'send_token_home_entry',
  SEND_TOKEN_CONFIRM_ENTRY = 'send_token_confirm_entry',

  // payment security service
  PAYMENT_SECURITY_HOME_ENTRY = 'payment_security_home_entry',
  PAYMENT_SECURITY_DETAIL_ENTRY = 'payment_security_detail_entry',
  PAYMENT_SECURITY_EDIT_ENTRY = 'payment_security_edit_entry',

  // contact
  CONTACT_DETAIL_ENTRY = 'contact_detail_entry',
  CONTACT_ACTIVITY_ENTRY = 'contact_activity_entry',

  // ramp
  RAMP_HOME_ENTRY = 'ramp_home_entry',
  RAMP_PREVIEW_ENTRY = 'ramp_preview_entry',
}

export function isPortkeyEntries(variable: any): boolean {
  return Object.values(PortkeyEntries).includes(variable);
}

// launch mode register
export enum LaunchMode {
  STANDARD = 'standard',
  SINGLE_TASK = 'single_task',
  SINGLE_TOP = 'single_top',
}
export const LaunchModeSet = new Map<string, string>();
export const registerLaunchMode = () => {
  LaunchModeSet.set(PortkeyEntries.ACCOUNT_SETTING_ENTRY, LaunchMode.SINGLE_TASK);
  LaunchModeSet.set(PortkeyEntries.PAYMENT_SECURITY_HOME_ENTRY, LaunchMode.SINGLE_TASK);
  LaunchModeSet.set(PortkeyEntries.ASSETS_HOME_ENTRY, LaunchMode.SINGLE_TASK);
  LaunchModeSet.set(PortkeyEntries.RAMP_HOME_ENTRY, LaunchMode.SINGLE_TASK);
};

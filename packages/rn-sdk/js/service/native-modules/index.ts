import { NativeModules } from 'react-native';
import { PortkeyEntries } from '../../config/entries';
import { AcceptablePropsType, AcceptableValueType } from '../../model/container/BaseContainer';

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
}

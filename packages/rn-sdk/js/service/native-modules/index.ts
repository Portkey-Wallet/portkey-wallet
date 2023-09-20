import { NativeModules } from 'react-native';
import { PortkeyEntries } from '../../config/entries';

export const portkeyModulesEntity = NativeModules as PortkeyNativeModules;

export interface PortkeyNativeModules {
  RouterModule: RouterModule;
  NativeWrapperModule: NativeWrapperModule;
}

export interface RouterModule {
  navigateTo: (entry: PortkeyEntries, targetScene?: string) => void;
  navigateToWithOptions: <R>(
    targetEntry: string,
    from: string,
    params: RouterOptions,
    callback: (res: EntryResult<R>) => void,
  ) => void;
  navigateBack: <R>(from: string, result: EntryResult<R>) => void;
}

export interface EntryResult<R> {
  result: R;
  status: 'success' | 'fail' | 'cancel';
  extraMsg?: { [x: string]: any };
}

export interface RouterOptions {
  closeCurrentScreen?: boolean;
  navigationAnimation?: 'none' | 'slide' | 'fade';
  navigationAnimationDuration?: number;
  targetScene?: string;
  params?: Array<string>;
}

export interface NativeWrapperModule {
  onError: (from: string, errMsg: string, data: { [x: string]: any }) => void;
  onFatalError: (from: string, errMsg: string, data: { [x: string]: any }) => void;
  onWarning: (from: string, warnMsg: string) => void;
  getPlatformName: () => string;
}

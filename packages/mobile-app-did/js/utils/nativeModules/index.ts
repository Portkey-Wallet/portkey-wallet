import { NativeModules } from 'react-native';

export interface PortkeyAppNativeModules {
  AppLifeCycleModule: AppLifeCycleModule;
}

export interface AppLifeCycleModule {
  /**
   * Calling this method will restart the app perfectly, only available on Android.
   */
  restartApp: () => void;
}

const PortkeyAppNativeModules = NativeModules as PortkeyAppNativeModules;

export const AppLifeCycleModule = PortkeyAppNativeModules.AppLifeCycleModule;

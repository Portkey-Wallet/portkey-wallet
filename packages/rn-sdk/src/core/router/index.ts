import { LaunchMode, LaunchModeSet } from 'global/init/entries';
import { NativeModules } from 'react-native';

interface Router {
  navigate(target: string, params: any): void;
  back(): void;
}
export function wrapEntry(entry: string) {
  const prefix = 'portkey_';
  return prefix + entry;
}

class RNSDKRouter implements Router {
  navigate(target: string, params?: any) {
    console.log('RNSDKRouter navigate', target, params, NativeModules.RouterModule);
    NativeModules.RouterModule.navigateTo(
      wrapEntry(target),
      LaunchModeSet.get(target) || LaunchMode.STANDARD,
      'fromEntryName',
      'none',
      false,
      params as any,
    );
  }
  back() {
    NativeModules.RouterModule.navigateBack(null, '');
  }
}
const router = new RNSDKRouter();
export default router;

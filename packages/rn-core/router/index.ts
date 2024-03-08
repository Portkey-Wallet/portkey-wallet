import { NativeModules } from 'react-native';
import { LaunchMode, LaunchModeSet } from './init';

interface Router {
  navigate(target: string, params: any);
  back();
}
export function wrapEntry(entry: string) {
  const prefix = 'portkey_';
  return prefix + entry;
}

class RNSDKRouter implements Router {
  navigate(target: string, params: any) {
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

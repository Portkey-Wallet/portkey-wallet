import { LaunchMode, LaunchModeSet } from 'global/init/entries';
import { NativeModules } from 'react-native';
import { COMMON_ROUTER_FROM } from './context';
import { wrapEntry } from 'utils/commonUtil';
import { EntryResult } from 'service/native-modules';

interface Router {
  navigate(target: string, params: any): void;
  navigateByResult(target: string, params: any, callback: (result: any) => void): void;
  back<R>(res: EntryResult<R>, params: any): void;
}

class RNSDKRouter implements Router {
  back<R>(res: EntryResult<R>, params: any): void {
    NativeModules.RouterModule.navigateBack(res, params?.from ?? COMMON_ROUTER_FROM);
  }

  navigate(target: string, params: any) {
    NativeModules.RouterModule.navigateTo(
      wrapEntry(target),
      LaunchModeSet.get(target) || LaunchMode.STANDARD,
      params?.from ?? COMMON_ROUTER_FROM,
      params?.targetScene ?? 'none',
      params?.closeSelf ?? false,
      params as any,
    );
  }

  navigateByResult(target: string, params: any, callback: (result: any) => void) {
    NativeModules.RouterModule.navigateToWithOptions(
      wrapEntry(target),
      LaunchModeSet.get(target) || LaunchMode.STANDARD,
      params?.from ?? COMMON_ROUTER_FROM,
      {
        params: params ?? ({} as any),
        closeCurrentScreen: params?.closeSelf ?? false,
        targetScene: params?.targetScene ?? 'none',
      },
      callback,
    );
  }
}
const router = new RNSDKRouter();
export default router;

import { LaunchMode, LaunchModeSet } from './types';
import { NativeModules } from 'react-native';
import { COMMON_ROUTER_FROM } from './context';
import { wrapEntry } from 'utils/commonUtil';
import { EntryResult } from 'service/native-modules';
import { PortkeyEntries } from './types';
import { mapRoute, AppRouteName } from './map';
import { Stack } from './stack';
const ThrottleMap: { [key: string]: number } = {};
interface Router {
  navigate(target: string, params: any): void;
  navigateByResult(target: string, params: any, callback: (result: any) => void): void;
  back<R>(res: EntryResult<R>, params: any): void;
}
export type EventName = 'focus' | 'blur';
export type Route = {
  name: PortkeyEntries;
  params: any;
};
class RNSDKRouter implements Router {
  private pages = new Stack<Route>();
  private listeners: Record<string, Record<EventName, ((...args: any[]) => void)[]>> = {};
  private singleTask_push(item: Route) {
    if (LaunchModeSet.get(item.name) === LaunchMode.SINGLE_TASK && router.contains(item)) {
      while (this.canGoBack() && this.peek()?.name !== item.name) {
        this.pop();
      }
      return true;
    }
    return false;
  }

  back<R>(res: EntryResult<R>, params: any): void {
    router.listenersFunc()[params.from]['blur'].forEach(item => item());
    this.pop();
    NativeModules.RouterModule.navigateBack(res, params?.from ?? COMMON_ROUTER_FROM);
  }

  reset(name: any | { name: any; params?: any }[], params?: any, from?: string) {
    const key = JSON.stringify(name);
    // throttle
    if (ThrottleMap[key] && Date.now() - ThrottleMap[key] < 2000) return;
    ThrottleMap[key] = Date.now();
    this.clear();
    if (Array.isArray(name)) {
      NativeModules.RouterModule.reset(
        wrapEntry(mapRoute(name[0].name)),
        from ?? 'ThirdParty',
        params?.targetScene ?? 'none',
        params as any,
      );
      name.slice(1).forEach(it => {
        NativeModules.RouterModule.navigate(
          wrapEntry(mapRoute(it.name)),
          from ?? 'ThirdParty',
          it?.params?.targetScene ?? 'none',
          it?.params as any,
        );
      });
    } else {
      NativeModules.RouterModule.reset(
        wrapEntry(mapRoute(name)),
        from ?? 'ThirdParty',
        params?.targetScene ?? 'none',
        params as any,
      );
    }
  }

  navigate(target: string, params: any) {
    const sdkRouteName = mapRoute(target as AppRouteName);
    router.listenersFunc()[params.from]['blur'].forEach(item => item());
    NativeModules.RouterModule.navigateTo(
      wrapEntry(sdkRouteName),
      LaunchModeSet.get(sdkRouteName) || LaunchMode.STANDARD,
      params?.from ?? 'ThirdParty',
      params?.targetScene ?? 'none',
      params?.closeSelf ?? false,
      params as any,
    );
  }

  navigateByResult(target: string, params: any, callback: (result: any) => void) {
    const sdkRouteName = mapRoute(target as AppRouteName);
    router.listenersFunc()[params.from]['blur'].forEach(item => item());
    NativeModules.RouterModule.navigateToWithOptions(
      wrapEntry(sdkRouteName),
      LaunchModeSet.get(sdkRouteName) || LaunchMode.STANDARD,
      params?.from ?? 'ThirdParty',
      {
        params: params ?? ({} as any),
        closeCurrentScreen: params?.closeSelf ?? false,
        targetScene: params?.targetScene ?? 'none',
      },
      callback,
    );
  }

  push(item: Route) {
    if (this.singleTask_push(item)) {
      return;
    }
    this.pages.push(item);
  }

  pop() {
    this.pages.pop();
  }
  peek() {
    return this.pages.peek();
  }
  allItem() {
    return this.pages.allItem();
  }
  contains(item: Route) {
    return this.allItem().some(it => it.name === item.name);
  }
  clear() {
    this.pages.clear();
  }
  canGoBack() {
    return !this.pages.isEmpty();
  }
  addListener(page: PortkeyEntries, type: EventName, callback: () => void) {
    console.log('this.listeners', this.listeners);
    if (!this.listeners[page]) {
      this.listeners[page] = {
        focus: [],
        blur: [],
      };
    }
    if (!this.listeners[page][type]) {
      this.listeners[page][type] = [];
    }
    this.listeners[page][type].push(callback);
    return () => {
      this.removeListener(page, type, callback);
    };
  }
  removeListener(page: PortkeyEntries, type: EventName, callback: () => void) {
    this.listeners[page][type] = this.listeners[page][type].filter(cb => cb !== callback);
  }
  listenersFunc() {
    return this.listeners;
  }
}
const router = new RNSDKRouter();
export default router;

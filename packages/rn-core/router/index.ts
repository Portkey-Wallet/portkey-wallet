import { LaunchMode, LaunchModeSet } from './types';
import { NativeModules } from 'react-native';
import { COMMON_ROUTER_FROM } from './context';
import { wrapEntry } from 'utils/commonUtil';
import { EntryResult } from 'service/native-modules';
import { PortkeyEntries } from './types';
import { Stack } from './stack';

interface Router {
  navigate(target: string, params: any): void;
  navigateByResult(target: string, params: any, callback: (result: any) => void): void;
  back<R>(res: EntryResult<R>, params: any): void;
}
export type EventName = 'focus' | 'blur';
class RNSDKRouter implements Router {
  private pages = new Stack<PortkeyEntries>();
  private listeners: Record<string, Record<EventName, ((...args: any[]) => void)[]>> = {};
  private singleTask_push(item: PortkeyEntries) {
    if (LaunchModeSet.get(item) === LaunchMode.SINGLE_TASK && router.contains(item)) {
      while (!this.pages.isEmpty() && this.pages.peek() !== item) {
        this.pages.pop();
      }
      return true;
    }
    return false;
  }

  back<R>(res: EntryResult<R>, params: any): void {
    this.pop();
    NativeModules.RouterModule.navigateBack(res, params?.from ?? COMMON_ROUTER_FROM);
  }

  navigate(target: string, params: any) {
    NativeModules.RouterModule.navigateTo(
      wrapEntry(target),
      LaunchModeSet.get(target) || LaunchMode.STANDARD,
      params?.from ?? 'ThirdParty',
      params?.targetScene ?? 'none',
      params?.closeSelf ?? false,
      params as any,
    );
  }

  navigateByResult(target: string, params: any, callback: (result: any) => void) {
    NativeModules.RouterModule.navigateToWithOptions(
      wrapEntry(target),
      LaunchModeSet.get(target) || LaunchMode.STANDARD,
      params?.from ?? 'ThirdParty',
      {
        params: params ?? ({} as any),
        closeCurrentScreen: params?.closeSelf ?? false,
        targetScene: params?.targetScene ?? 'none',
      },
      callback,
    );
  }

  push(item: PortkeyEntries) {
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
  contains(item: PortkeyEntries) {
    return this.pages.contains(item);
  }

  canGoBack() {
    return !this.pages.isEmpty;
  }
  addListener(page: PortkeyEntries, type: EventName, callback: () => void) {
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

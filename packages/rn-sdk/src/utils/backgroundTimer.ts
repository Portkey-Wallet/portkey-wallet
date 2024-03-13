import { isIOS } from 'packages/utils/mobile/device';
import _BackgroundTimer from 'react-native-background-timer';

export const setBackgroundTimeout = (callback: any, timeout: number): NodeJS.Timer =>
  isIOS ? setTimeout(callback, timeout) : (_BackgroundTimer.setTimeout(callback, timeout) as any);
export const clearBackgroundTimeout = (intervalId: any) =>
  isIOS ? clearTimeout(intervalId) : _BackgroundTimer.clearTimeout(intervalId);

export const setBackgroundInterval = (callback: any, timeout: number): NodeJS.Timer =>
  isIOS ? setInterval(callback, timeout) : (_BackgroundTimer.setInterval(callback, timeout) as any);
export const clearBackgroundInterval = (intervalId: any) =>
  isIOS ? clearInterval(intervalId) : _BackgroundTimer.clearInterval(intervalId);

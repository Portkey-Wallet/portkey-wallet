import { setLocalStorage } from 'utils/storage/chromeStorage';
import storage from '../storage';

/**
 * 防抖函数
 * func: 要执行的函数
 * delay: 防抖的时间间隔
 * 返回值: 包装后的函数（带有防抖功能）
 */
export function debounce<T extends (...args: any[]) => void>(func: T, delay: number): (...args: Parameters<T>) => void {
  let timeout: number | null = null;

  return function (...args: Parameters<T>): void {
    if (timeout !== null) {
      clearTimeout(timeout);
    }

    timeout = window.setTimeout(() => {
      func(...args); // 延迟后执行传入的函数
    }, delay);
  };
}

function updateUserActivityTime() {
  const time = new Date().toISOString();
  console.log('updateUserActivityTime called at', time);
  setLocalStorage({
    [storage.userActivityTime]: time,
  });
}

export function updateUserActivityListeners() {
  const events = ['mousemove', 'mousedown', 'keypress', 'scroll', 'touchstart'];
  events.forEach((event) => {
    window.addEventListener(event, debounce(updateUserActivityTime, 1000));
  });
}

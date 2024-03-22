import CommonToast from '@portkey-wallet/rn-components/components/CommonToast';
import { setStringAsync } from 'expo-clipboard';
import i18n from 'i18n';
import { BackEndNetWorkMap } from '@portkey-wallet/constants/constants-ca/backend-network';

// eslint-disable-next-line @typescript-eslint/ban-types
export function myThrottle(fn: Function, delay: number) {
  let timer: NodeJS.Timeout | null;
  return function ({ data }: { data: string }) {
    if (!timer) {
      // eslint-disable-next-line prefer-rest-params, @typescript-eslint/ban-ts-comment
      // @ts-ignore
      fn.call(this, { data });
      timer = setTimeout(() => {
        if (timer) {
          clearTimeout(timer);
          timer = null;
        }
      }, delay);
    }
  };
}
export const doubleClick = (fun: (params: any) => void, params: any, interval = 200): void => {
  let isCalled = false;
  let timer: NodeJS.Timeout | undefined;
  if (!isCalled) {
    isCalled = true;
    timer && clearTimeout(timer);
    timer = setTimeout(() => {
      isCalled = false;
    }, interval);
    return fun(params);
  }
};

export const checkIsSvgUrl = (imgUrl: string) => {
  return /.svg$/.test(imgUrl);
};

export const selectCurrentBackendConfig = (endPointUrl: string) => {
  const value = Object.values(BackEndNetWorkMap).find(it => endPointUrl === it.apiUrl);
  if (!value) throw new Error('invalid endPointUrl');
  return value;
};

export const copyText = async (text: string) => {
  try {
    const isCopy = await setStringAsync(text);
    isCopy && CommonToast.success(i18n.t('Copy Success'));
  } catch {
    CommonToast.success(i18n.t('Copy Fail'));
  }
};

export function wrapEntry(entry: string) {
  const prefix = 'portkey_';
  return prefix + entry;
}

export const getEllipsisTokenShow = (amountShow: string, symbol: string, digits = 21) => {
  const amountShowLen = amountShow?.length || 0;
  const symbolLen = symbol?.length || 0;
  if (amountShowLen + symbolLen > digits) return `${amountShow.slice(0, digits - symbolLen)}... ${symbol}`;

  return `${amountShow} ${symbol}`;
};

export function compareVersions(v1: string, v2: string) {
  const v1Parts = v1.split('.').map(Number);
  const v2Parts = v2.split('.').map(Number);

  for (let i = 0; i < Math.max(v1Parts.length, v2Parts.length); i++) {
    const v1Part = v1Parts[i] || 0;
    const v2Part = v2Parts[i] || 0;
    if (v1Part < v2Part) {
      return -1;
    } else if (v1Part > v2Part) {
      return 1;
    }
  }
  return 0;
}

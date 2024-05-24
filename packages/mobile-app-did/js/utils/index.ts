import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc.js';
import * as Network from 'expo-network';
import { setStringAsync } from 'expo-clipboard';
import { Timestamp } from '@portkey-wallet/types';
dayjs.extend(utc);

export const INFINITY = 'Infinity';

export const checkNetwork = async () => {
  const state = await Network.getNetworkStateAsync();
  if (!state.isConnected || !state.isInternetReachable) throw new Error('Unstable network. Please try again later.');
};

export const getFaviconUrl = (url: string) => {
  const reg = /:\/\/(.[^/]+)/;
  const domain = url.match(reg);
  const newDomain = domain ? domain[1] : '';
  return `http://${newDomain}/favicon.ico`;
};

export const getFaviconUrlFromDomain = (domain = '') => {
  return `https://${domain}/favicon.ico`;
};

/**
 * a mobile app func to copy text
 * @param text
 */
export const copyText = async (text: string) => {
  try {
    await setStringAsync(text);
    // isCopy && CommonToast.success(i18n.t('Copy Success'));
  } catch {
    // CommonToast.success(i18n.t('Copy Fail'));
  }
};
/**
 *
 * @param imgUrl
 * @returns
 */
export const checkIsSvgUrl = (imgUrl: string) => {
  return /.svg$/.test(imgUrl);
};

/**
 * A method to determine whether a number is within an interval, like (10,100]
 * @param num
 * @param left
 * @param right
 * @returns
 */
export const isNumberInInterval = (
  num: number,
  left: number | typeof INFINITY,
  right: number | typeof INFINITY,
): boolean => {
  if (left === 'Infinity' && typeof right === 'number') return num <= right;
  if (right === 'Infinity' && typeof left === 'number') return num > left;
  if (typeof left === 'number' && typeof right === 'number') return num > left && num <= right;

  return true;
};

/**
 * isExpired
 * @param timestamp
 * @returns
 */
export const isExpired = (timestamp: Timestamp): boolean => dayjs().isAfter(timestamp);

export const parseVersion = (list: (string | undefined | null)[]) =>
  list.reduce((pre, cv) => (cv ? `${pre}(${cv})` : pre));

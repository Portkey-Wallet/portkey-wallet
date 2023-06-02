import { DappStoreItem } from '@portkey-wallet/store/store-ca/dapp/type';
import isUrl from 'is-url';
import Url from 'url-parse';

/**
 * Return an URL object from url string
 *
 * @param url - String containing url
 * @returns - URL object
 */
export function getUrlObj(url: string) {
  return new Url(url);
}

/**
 * Returns URL prefixed with protocol
 *
 * @param url - String corresponding to url
 * @param defaultProtocol - Protocol string to append to URLs that have none
 * @returns - String corresponding to sanitized input depending if it's a search or url
 */
export const prefixUrlWithProtocol = (url: string, defaultProtocol = 'https://') => {
  const hasProtocol = /^[a-z]*:\/\//.test(url);
  const sanitizedURL = hasProtocol ? url : `${defaultProtocol}${url}`;
  return sanitizedURL;
};
/**
 * Return host from url string
 *
 * @param url - String containing url
 * @param defaultProtocol
 * @returns - String corresponding to host
 */
export function getHost(url: string, defaultProtocol = 'https://') {
  const isValidUrl = isUrl(url);
  if (!isValidUrl) return url;

  const sanitizedUrl = prefixUrlWithProtocol(url, defaultProtocol);
  const { hostname } = getUrlObj(sanitizedUrl);

  const result = hostname === '' ? url : hostname;

  return result;
}

export function isEqDapp(dapp1?: DappStoreItem, dapp2?: DappStoreItem) {
  if (!dapp1 || !dapp2) return false;
  return dapp1.origin === dapp2.origin && dapp1.name === dapp2.name && dapp1.icon === dapp2.icon;
}

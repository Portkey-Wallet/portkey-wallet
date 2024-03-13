import isUrl from 'is-url';
import { DappStoreItem } from 'packages/store/store-ca/dapp/type';
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
 * check if url is ip
 * @param url
 * @returns
 */
export const isDangerousLink = (url: string): boolean => {
  return /^(?:http:\/\/)?[\w.-]+(?:\.[\w.-]+)+[\w\-._~:/?#[\]@!&',;=.+]+$/g.test(url);
};

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
/**
 *
 * @param url
 * @returns
 */
export function getProtocolAndHost(url: string) {
  const { protocol, hostname } = getUrlObj(url);
  return `${protocol}//${hostname}`;
}
/**
 *
 * @param url
 * @returns
 */
export function getOrigin(url: string) {
  const { protocol, hostname, port } = getUrlObj(url);
  if (port) {
    return `${protocol}//${hostname}:${port}`;
  } else {
    return `${protocol}//${hostname}`;
  }
}

/**
 * getFaviconUrl
 * @param url
 * @param size
 * @returns string
 */
export function getFaviconUrl(url: string, size = 50): string {
  return `https://icon.horse/icon/${getHost(url)}/${size}`;
}

/**
 * Returns URL prefixed with protocol, which could be a search engine url if
 * a keyword is detected instead of a url
 *
 * @param input - String corresponding to url input
 * @param defaultProtocol - Protocol string to append to URLs that have none
 * @returns - String corresponding to sanitized input depending if it's a search or url
 */
export default function getFullUrl(input: string, defaultProtocol = 'https://') {
  //Check if it's a url or a keyword
  return prefixUrlWithProtocol(input, defaultProtocol);
}

export const checkIsUrl = (value: string) => {
  const regEx = new RegExp(/^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w.-]+)+[\w\-._~:/?#[\]@!&',;=.+]+$/g);
  if (!isUrl(value) && !regEx.test(value)) return false;
  return true;
};

export function isEqDapp(dapp1?: DappStoreItem, dapp2?: DappStoreItem) {
  if (!dapp1 || !dapp2) return false;
  return dapp1.origin === dapp2.origin && dapp1.name === dapp2.name && dapp1.icon === dapp2.icon;
}

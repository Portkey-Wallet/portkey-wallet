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

/**
 * getFaviconUrl
 * @param url
 * @param size
 * @returns string
 */
export function getFaviconUrl(url: string, size: number = 50): string {
  return `https://api.faviconkit.com/${getHost(url)}/${size}`;
}

/**
 * Returns URL prefixed with protocol, which could be a search engine url if
 * a keyword is detected instead of a url
 *
 * @param input - String corresponding to url input
 * @param searchEngine - Protocol string to append to URLs that have none
 * @param defaultProtocol - Protocol string to append to URLs that have none
 * @returns - String corresponding to sanitized input depending if it's a search or url
 */
export default function onUrlSubmit(input: string, searchEngine = 'Google', defaultProtocol = 'https://') {
  //Check if it's a url or a keyword
  const regEx = new RegExp(/^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w.-]+)+[\w\-._~:/?#[\]@!&',;=.+]+$/g);
  if (!isUrl(input) && !regEx.test(input)) {
    // Add exception for localhost
    if (!input.startsWith('http://localhost') && !input.startsWith('localhost')) {
      // In case of keywords we default to google search
      let searchUrl = 'https://www.google.com/search?q=' + encodeURIComponent(input);
      if (searchEngine === 'DuckDuckGo') {
        searchUrl = 'https://duckduckgo.com/?q=' + encodeURIComponent(input);
      }
      return searchUrl;
    }
  }
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

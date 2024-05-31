import { NetworkList } from '@portkey-wallet/constants/constants-ca/network';
import { NetworkType } from '@portkey-wallet/types';
import {
  ENVIRONMENT_TYPE_POPUP,
  ENVIRONMENT_TYPE_PROMPT,
  // ENVIRONMENT_TYPE_FULLSCREEN,
  ENVIRONMENT_TYPE_SERVICE_WORKER,
} from 'constants/envType';
import moment from 'moment';
import { apis } from './BrowserApis';

export const omitString = (input: string, start = 10, end = 10) => {
  if (!input) return '';
  return `${input.slice(0, start)}...${input.slice(-end)}`;
};

export const formatToAddress = (address: string) => {
  if (address.includes('_')) return address.split('_')[1];
  return address;
};

export const dateFormat = (ipt?: moment.MomentInput) => {
  return moment(ipt).format('MMM D , h:mm a').replace(',', 'at');
};

export const dateFormatTransTo13 = (ipt?: moment.MomentInput) => {
  let time = String(ipt);
  while (time.length < 13) {
    time = time + '0';
  }
  return moment(Number(time)).format('MMM D , h:mm a').replace(',', 'at');
};

/**
 * Returns an Error if extension.runtime.lastError is present
 * this is a workaround for the non-standard error object that's used
 */
export const checkForError = (): void | Error => {
  const { lastError } = apis.runtime;
  if (!lastError) return undefined;
  if (lastError.message) return new Error(lastError.message);
};

export const getEnvironmentType = (url: string) => {
  const parsedUrl = new URL(url);
  // from popup page
  if (parsedUrl.pathname === '/popup.html') {
    return ENVIRONMENT_TYPE_POPUP;
    // } else if (['/home.html'].includes(parsedUrl.pathname)) {
    //   return ENVIRONMENT_TYPE_FULLSCREEN;
    // from prompt page
  } else if (parsedUrl.pathname === '/prompt.html') {
    return ENVIRONMENT_TYPE_PROMPT;
  }
  // from  content js
  return ENVIRONMENT_TYPE_SERVICE_WORKER;
};

export const getPortkeyFinanceUrl = (currentNetwork: NetworkType) => {
  const {
    portkeyFinanceUrl: host = '',
    portkeyOpenLoginUrl: webPageUrl = '',
    networkType = '',
    domain,
    apiUrl,
  } = NetworkList.find((item) => item.networkType === currentNetwork) || {};

  return {
    JOIN_AUTH_URL: `${host}/join`,
    JOIN_TELEGRAM_URL: `${webPageUrl}/social-login/Telegram?from=portkey&network=${networkType}`,
    AUTH_APPLE_URL: `${host}/apple-auth`,
    RECAPTCHA_URL: `${host}/recaptcha-check`,
    OPEN_LOGIN_URL: webPageUrl,
    domain: domain || apiUrl,
  };
};

export const getImageUrlBySymbol = (symbol: string | undefined) => {
  if (symbol === 'USDT') {
    return 'https://dynamic-assets.coinbase.com/41f6a93a3a222078c939115fc304a67c384886b7a9e6c15dcbfa6519dc45f6bb4a586e9c48535d099efa596dbf8a9dd72b05815bcd32ac650c50abb5391a5bd0/asset_icons/1f8489bb280fb0a0fd643c1161312ba49655040e9aaaced5f9ad3eeaf868eadc.png';
  } else if (symbol === 'SGR-1' || symbol === 'SGR') {
    return 'https://raw.githubusercontent.com/Awaken-Finance/assets/main/blockchains/AELF/assets/SGR-1/logo24%403x.png';
  }
  return '';
};

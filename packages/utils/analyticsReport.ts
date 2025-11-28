import { ENV_NAME } from '@portkey-wallet/constants/constants-ca/network';

export const enum CUSTOM_EVENT_ENUM {
  LOGIN = 'login_custom',
  PAGESHOW = 'page_show',
  NAV_BACK = 'nav_back',
  ENTER_SEND_CRYPTO_GIFT_PAGE = 'enter_send_crypto_gift_page',
  SEND_CRYPTO_GIFT_SUCCESS = 'send_crypto_gift_success',
  REFERRAL_CLICK = 'referral_click',
}

export const enum NETWORK_TYPE {
  MAINNET = 'main',
  TESTNET = 'testnet',
}

export type eventParamsType = {
  page_name?: string;
  network_type?: NETWORK_TYPE;
};

export const checkEnvironmentIsProduction = () => {
  return ENV_NAME === 'online';
};

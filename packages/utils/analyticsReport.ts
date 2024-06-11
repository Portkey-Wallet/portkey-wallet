import { ENV_NAME } from '@portkey-wallet/constants/constants-ca/network';

export const enum CUSTOM_EVENT_ENUM {
  LOGIN = 'login_custom',
  PAGESHOW = 'page_show',
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

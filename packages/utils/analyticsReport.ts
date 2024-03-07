import { ENV_NAME } from '@portkey-wallet/constants/constants-ca/network';

export const enum CUSTOM_EVENT_ENUM {
  LOGIN = 'login_custom',
}

export const enum NETWORK_TYPE {
  MAINNET = 'main',
  TESTNET = 'testnet',
}

export type eventParamsType = {
  network_type?: NETWORK_TYPE;
};

export const checkEnvironmentIsProduction = () => {
  return ENV_NAME === 'online';
};

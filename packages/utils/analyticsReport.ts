import { request } from '@portkey-wallet/api/api-did';

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
  const url = request.defaultConfig.baseURL || '';
  return /(http(s?):\/\/)?did-portkey.*(\.portkey\.finance)$/.test(url);
};

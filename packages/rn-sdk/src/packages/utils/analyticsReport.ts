import { request } from 'packages/api/api-did';

export const enum CUSTOM_EVENT_ENUM {
  LOGIN = 'login_custom',
}

export const checkEnvironmentIsProduction = () => {
  const url = request.defaultConfig.baseURL || '';
  return /(http(s?):\/\/)?did-portkey.*(\.portkey\.finance)$/.test(url);
};

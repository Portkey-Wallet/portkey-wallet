import injector from '..';
const { environment } = injector.getConfig();
let request;

if (environment === 'SDK') {
  request = import('@portkey-wallet/rn-core/network/index').then(module => module.request);
} else {
  request = import('@portkey-wallet/api/api-did').then(module => module.request);
}

export { request };

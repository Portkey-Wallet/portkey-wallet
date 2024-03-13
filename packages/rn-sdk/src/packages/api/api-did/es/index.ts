import { ESBaseConfig } from './type';

const Method = 'GET';
const BaseESUrl = `/api/app/`;

const KeyList = [
  'getUserTokenList',
  'getChainsInfo',
  'getRegisterResult',
  'getRecoverResult',
  'getContactList',
  'getCaHolder',
] as const;

const ApiObject: Record<(typeof KeyList)[number], ESBaseConfig> = {
  getUserTokenList: {
    target: `${BaseESUrl}search/usertokenindex`,
    config: { method: Method },
  },
  getChainsInfo: {
    target: `${BaseESUrl}search/chainsinfoindex`,
    config: { method: Method, params: { sort: 'chainId' } },
  },
  getRegisterResult: {
    target: `${BaseESUrl}search/accountregisterindex`,
    config: { method: Method },
  },
  getRecoverResult: {
    target: `${BaseESUrl}search/accountrecoverindex`,
    config: { method: Method },
  },
  getContactList: {
    target: `${BaseESUrl}contacts/list`,
    config: { method: Method },
  },
  getCaHolder: {
    target: `${BaseESUrl}search/caholderindex`,
    config: { method: Method },
  },
};

export default ApiObject;

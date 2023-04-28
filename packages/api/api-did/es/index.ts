import { ESBaseConfig } from './type';

const Method = 'GET';
const BaseESUrl = `/api/app/search/`;

const KeyList = [
  'getUserTokenList',
  'getChainsInfo',
  'getRegisterResult',
  'getRecoverResult',
  'getContactList',
  'getCaHolder',
] as const;

const ApiObject: Record<typeof KeyList[number], ESBaseConfig> = {
  getUserTokenList: {
    target: `${BaseESUrl}usertokenindex`,
    config: { method: Method },
  },
  getChainsInfo: {
    target: `${BaseESUrl}chainsinfoindex`,
    config: { method: Method, params: { sort: 'chainId' } },
  },
  getRegisterResult: {
    target: `${BaseESUrl}accountregisterindex`,
    config: { method: Method },
  },
  getRecoverResult: {
    target: `${BaseESUrl}accountrecoverindex`,
    config: { method: Method },
  },
  getContactList: {
    target: `${BaseESUrl}contactindex`,
    config: { method: Method },
  },
  getCaHolder: {
    target: `${BaseESUrl}caholderindex`,
    config: { method: Method },
  },
};

export default ApiObject;

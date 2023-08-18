import walletApi from './wallet';
import verificationApi from './verification';
import contactApi from './contact';
import chainApi from './chain';
import assetsApi from './assets';
import recentApi from './recent';
import tokenApi from './token';
import paymentApi from './payment';
import deviceApi from './device';
import messageApi from './message';
import switchApi from './switch';
import discoverApi from './discover';
import txFeeApi from './txFee';
import imApi from './im';

import esApi from './es';
import myServer, { DidService } from './server';
import { API_REQ_FUNCTION } from '../types';
import { ES_API_REQ_FUNCTION } from './es/type';
import activityApi from './activity';

export const DEFAULT_METHOD = 'POST';

/**
 * api request configuration directory
 * @example
 *    upload: {
 *      target: '/api/file-management/file-descriptor/upload',
 *      baseConfig: { method: 'POST', },
 *    },
 * or:
 *    upload:'/api/file-management/file-descriptor/upload'
 *
 * @description api configuration default method is from DEFAULT_METHOD
 * @type {UrlObj}  // The type of this object from UrlObj.
 */

export const BASE_APIS = {};

export const EXPAND_APIS = {
  wallet: walletApi,
  verify: verificationApi,
  contact: contactApi,
  chain: chainApi,
  // token: tokenApi,
  activity: activityApi,
  assets: assetsApi,
  recent: recentApi,
  token: tokenApi,
  payment: paymentApi,
  device: deviceApi,
  message: messageApi,
  switch: switchApi,
  discover: discoverApi,
  txFee: txFeeApi,
  im: imApi,
};

export type BASE_REQ_TYPES = {
  [x in keyof typeof BASE_APIS]: API_REQ_FUNCTION;
};

export type EXPAND_REQ_TYPES = {
  [X in keyof typeof EXPAND_APIS]: {
    [K in keyof typeof EXPAND_APIS[X]]: API_REQ_FUNCTION;
  };
};

export type ES_REQ_TYPES = Record<keyof typeof esApi, ES_API_REQ_FUNCTION>;

myServer.parseRouter('es', esApi as any);

myServer.parseRouter('base', BASE_APIS);

Object.entries(EXPAND_APIS).forEach(([key, value]) => {
  myServer.parseRouter(key, value as any);
});

export interface IRequest extends BASE_REQ_TYPES, EXPAND_REQ_TYPES {
  es: ES_REQ_TYPES;
}

const request = myServer as unknown as IRequest & DidService;

export { request };

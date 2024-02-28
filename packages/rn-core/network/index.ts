import walletApi from '@portkey-wallet/api/api-did/wallet';
import verificationApi from '@portkey-wallet/api/api-did/verification';
import contactApi from '@portkey-wallet/api/api-did/contact';
import chainApi from '@portkey-wallet/api/api-did/chain';
import assetsApi from '@portkey-wallet/api/api-did/assets';
import recentApi from '@portkey-wallet/api/api-did/recent';
import tokenApi from '@portkey-wallet/api/api-did/token';
import deviceApi from '@portkey-wallet/api/api-did/device';
import messageApi from '@portkey-wallet/api/api-did/message';
import switchApi from '@portkey-wallet/api/api-did/switch';
import discoverApi from '@portkey-wallet/api/api-did/discover';
import txFeeApi from '@portkey-wallet/api/api-did/txFee';
// import imApi from '@portkey-wallet/api/api-did/im';
import privacyApi from '@portkey-wallet/api/api-did/privacy';

import esApi from '@portkey-wallet/api/api-did/es';
import { DidService } from '@portkey-wallet/api/api-did/server';
import { API_REQ_FUNCTION } from '@portkey-wallet/api/types';
import { ES_API_REQ_FUNCTION } from '@portkey-wallet/api/api-did/es/type';
import activityApi from '@portkey-wallet/api/api-did/activity';
import securityApi from '@portkey-wallet/api/api-did/security';
import guideApi from '@portkey-wallet/api/api-did/guide';
import managerApi from '@portkey-wallet/api/api-did/manager';
import referralApi from '@portkey-wallet/api/api-did/referral';
import { CLIENT_TYPE } from '@portkey-wallet/api/api-did/types';
import { SDKFetch } from './request';

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
  token: tokenApi,
  activity: activityApi,
  assets: assetsApi,
  recent: recentApi,
  device: deviceApi,
  message: messageApi,
  switch: switchApi,
  discover: discoverApi,
  txFee: txFeeApi,
  // im: imApi,
  security: securityApi,
  privacy: privacyApi,
  guide: guideApi,
  manager: managerApi,
  referral: referralApi,
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

export interface IRequest extends BASE_REQ_TYPES, EXPAND_REQ_TYPES {
  es: ES_REQ_TYPES;
}

const rnSDKServer = new DidService(new SDKFetch());
rnSDKServer.parseRouter('es', esApi as any);
rnSDKServer.parseRouter('base', BASE_APIS);
Object.entries(EXPAND_APIS).forEach(([key, value]) => {
  rnSDKServer.parseRouter(key, value as any);
});

const request = rnSDKServer as unknown as IRequest & DidService;
export { request };

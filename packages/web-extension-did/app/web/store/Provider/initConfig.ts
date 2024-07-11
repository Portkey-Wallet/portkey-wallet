import { request } from '@portkey-wallet/api/api-did';
import { PlatFormInHeader } from '@portkey-wallet/api/api-did/types';
import { did } from '@portkey/did-ui-react';
import BigNumber from 'bignumber.js';

export function initConfig() {
  BigNumber.set({ ROUNDING_MODE: BigNumber.ROUND_DOWN });
}

export function initRequest() {
  request.set('headers', { version: `${process.env.SDK_VERSION}`, platform: PlatFormInHeader.EXTENSION });
}

export async function getDidReactSDKToken() {
  const token = await request.getConnectToken();
  return token;
}

export async function initDidReactSDKToken(AuthToken?: string) {
  let token = AuthToken;
  if (!token) token = await getDidReactSDKToken();
  const requestDefaults = did.config.requestDefaults ? did.config.requestDefaults : {};

  if (!token) return;
  if (!requestDefaults.headers) requestDefaults.headers = {};
  requestDefaults.headers = {
    ...requestDefaults?.headers,
    Authorization: token,
  };
  did.setConfig({ requestDefaults });
}

export async function getAuthToken() {
  // set Authorization
  const walletToken = (request.defaultConfig.headers as any)?.Authorization;
  const token = did.config.requestDefaults?.headers?.Authorization;
  if (token && walletToken === token) return;
  if (!token) await initDidReactSDKToken();
}

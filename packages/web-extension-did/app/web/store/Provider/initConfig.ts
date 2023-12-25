import { request } from '@portkey-wallet/api/api-did';
import BigNumber from 'bignumber.js';
import { localStorage } from 'redux-persist-webextension-storage';

export function initConfig() {
  BigNumber.set({ ROUNDING_MODE: BigNumber.ROUND_DOWN });
}

export function initRequest() {
  request.set('headers', { version: `${process.env.SDK_VERSION}` });
  request.setStorage(localStorage);
}

import {
  ImmutableStateInvariantMiddlewareOptions,
  SerializableStateInvariantMiddlewareOptions,
} from '@reduxjs/toolkit';
import { FLUSH, PAUSE, PERSIST, PURGE, REGISTER, REHYDRATE } from 'redux-persist';
import { localStorage } from 'redux-persist-webextension-storage';
import { reduxStorageRoot } from 'constants/index';
import { walletSlice } from '@portkey-wallet/store/store-ca/wallet/slice';
import chainSlice from '@portkey-wallet/store/network/slice';
import tokenBalanceSlice from '@portkey-wallet/store/tokenBalance/slice';
import tradeSlice from '@portkey-wallet/store/trade/slice';
import tokenSlice from '@portkey-wallet/store/token/slice';
import assetsSlice from '@portkey-wallet/store/store-ca/assets/slice';
import { loginSlice } from 'store/reducers/loginCache/slice';
import { contactSlice } from '@portkey-wallet/store/store-ca/contact/slice';
import { miscSlice } from '@portkey-wallet/store/store-ca/misc/slice';
import { guardiansSlice } from '@portkey-wallet/store/store-ca/guardians/slice';
import activitySlice from '@portkey-wallet/store/store-ca/activity/slice';
import recentSlice from '@portkey-wallet/store/store-ca/recent/slice';
import { paymentSlice } from '@portkey-wallet/store/store-ca/payment/slice';
import { cmsSlice } from '@portkey-wallet/store/store-ca/cms/slice';
import { dappSlice } from '@portkey-wallet/store/store-ca/dapp/slice';

interface ThunkOptions<E = any> {
  extraArgument: E;
}

export interface DefaultMiddlewareOptions {
  thunk?: boolean | ThunkOptions;
  immutableCheck?: boolean | ImmutableStateInvariantMiddlewareOptions;
  serializableCheck?: boolean | SerializableStateInvariantMiddlewareOptions;
}

export const tokenPersistConfig = {
  key: tokenSlice.name,
  storage: localStorage,
  blacklist: ['tokenDataShowInMarket'],
};

export const assetPersistConfig = {
  key: assetsSlice.name,
  storage: localStorage,
  blacklist: [''],
};

export const activityPersistConfig = {
  key: activitySlice.name,
  storage: localStorage,
  // whitelist: ['failedActivityMap'],
};

export const recentPersistConfig = {
  key: recentSlice.name,
  storage: localStorage,
};

export const walletPersistConfig = {
  key: walletSlice.name,
  storage: localStorage,
  blacklist: [''],
};

export const dappPersistConfig = {
  key: dappSlice.name,
  storage: localStorage,
};

export const loginPersistConfig = {
  key: loginSlice.name,
  storage: localStorage,
  blacklist: ['scanWalletInfo', 'scanCaWalletInfo'],
};

export const contactPersistConfig = {
  key: contactSlice.name,
  storage: localStorage,
  blacklist: [''],
};

export const miscPersistConfig = {
  key: miscSlice.name,
  storage: localStorage,
  blacklist: [''],
};

export const guardiansPersistConfig = {
  key: guardiansSlice.name,
  storage: localStorage,
};

export const paymentPersistConfig = {
  key: paymentSlice.name,
  storage: localStorage,
};

export const cmsPersistConfig = {
  key: cmsSlice.name,
  storage: localStorage,
};

const reduxPersistConfig = {
  key: reduxStorageRoot,
  storage: localStorage,

  // Reducer keys that you do NOT want stored to persistence here.
  // blacklist: [],

  // Optionally, just specify the keys you DO want stored to persistence.
  // An empty array means 'don't store any reducers' -> infinite-red/ignite#409
  whitelist: [
    chainSlice.name,
    tokenBalanceSlice.name,
    tokenSlice.name,
    tradeSlice.name,
    activitySlice.name,
    walletSlice.name,
    assetsSlice.name,
    recentSlice.name,
    contactSlice.name,
    guardiansSlice.name,
    dappSlice.name,
  ],
  // More info here:  https://shift.infinite.red/shipping-persistant-reducers-7341691232b1
  // transforms: [SetTokenTransform],
};

const defaultMiddlewareOptions: DefaultMiddlewareOptions = {
  thunk: true,
  serializableCheck: {
    // https://redux-toolkit.js.org/usage/usage-guide#use-with-redux-persist
    ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
  },
};

export default {
  reduxPersistConfig,
  defaultMiddlewareOptions,
};

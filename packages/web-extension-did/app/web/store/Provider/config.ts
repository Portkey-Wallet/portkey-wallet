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
import { rampSlice } from '@portkey-wallet/store/store-ca/ramp/slice';
import { cmsSlice } from '@portkey-wallet/store/store-ca/cms/slice';
import { dappSlice } from '@portkey-wallet/store/store-ca/dapp/slice';
import { discoverSlice } from '@portkey-wallet/store/store-ca/discover/slice';
import { txFeeSlice } from '@portkey-wallet/store/store-ca/txFee/slice';
import imSlice from '@portkey-wallet/store/store-ca/im/slice';
import securitySlice from '@portkey-wallet/store/store-ca/security/slice';
import { referralSlice } from '@portkey-wallet/store/store-ca/referral/slice';
import cryptoGiftSlice from '@portkey-wallet/store/store-ca/cryptoGift/slice';

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

export const discoverPersistConfig = {
  key: discoverSlice.name,
  storage: localStorage,
};

export const txFeePersistConfig = {
  key: txFeeSlice.name,
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

export const rampPersistConfig = {
  key: rampSlice.name,
  storage: localStorage,
};

export const cmsPersistConfig = {
  key: cmsSlice.name,
  storage: localStorage,
  blacklist: ['activityModalListLoaded', 'currentShowedAcModalListMap'],
};

export const imPersistConfig = {
  key: imSlice.name,
  storage: localStorage,
  blacklist: ['channelMessageListNetMap', 'groupInfoMapNetMap', 'pinListNetMap', 'lastPinNetMap'],
};

export const cryptoGiftConfig = {
  key: cryptoGiftSlice.name,
  storage: localStorage,
};

export const referralPersistConfig = {
  key: referralSlice.name,
  storage: localStorage,
  blacklist: [],
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
    discoverSlice.name,
    txFeeSlice.name,
    // imSlice.name,
    securitySlice.name,
    referralSlice.name,
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

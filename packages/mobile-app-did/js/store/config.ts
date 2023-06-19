import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  ImmutableStateInvariantMiddlewareOptions,
  SerializableStateInvariantMiddlewareOptions,
} from '@reduxjs/toolkit';
import { FLUSH, PAUSE, PERSIST, PURGE, REGISTER, REHYDRATE } from 'redux-persist';
import { walletSlice } from '@portkey-wallet/store/wallet/slice';
import { contactSlice } from '@portkey-wallet/store/store-ca/contact/slice';
import { miscSlice } from '@portkey-wallet/store/store-ca/misc/slice';
import chainSlice from '@portkey-wallet/store/network/slice';
import { tokenBalanceSlice } from '@portkey-wallet/store/tokenBalance/slice';
import settingsSlice from '@portkey-wallet/store/settings/slice';
import recentSlice from '@portkey-wallet/store/store-ca/recent/slice';
import activitySlice from '@portkey-wallet/store/store-ca/activity/slice';
import switchSlice from '@portkey-wallet/store/store-ca/switch/slice';
import { cmsSlice } from '@portkey-wallet/store/store-ca/cms/slice';
import { dappSlice } from '@portkey-wallet/store/store-ca/dapp/slice';
import { paymentSlice } from '@portkey-wallet/store/store-ca/payment/slice';
import assetsSlice from '@portkey-wallet/store/store-ca/assets/slice';

interface ThunkOptions<E = any> {
  extraArgument: E;
}
export interface DefaultMiddlewareOptions {
  thunk?: boolean | ThunkOptions;
  immutableCheck?: boolean | ImmutableStateInvariantMiddlewareOptions;
  serializableCheck?: boolean | SerializableStateInvariantMiddlewareOptions;
}

const reduxPersistConfig = {
  key: 'root',
  storage: AsyncStorage,

  // Reducer keys that you do NOT want stored to persistence here.
  // blacklist: [],

  // Optionally, just specify the keys you DO want stored to persistence.
  // An empty array means 'don't store any reducers' -> infinite-red/ignite#409
  whitelist: [
    walletSlice.name,
    contactSlice.name,
    miscSlice.name,
    tokenBalanceSlice.name,
    settingsSlice.name,
    chainSlice.name,
    recentSlice.name,
    assetsSlice.name,
    activitySlice.name,
    switchSlice.name,
    dappSlice.name,
    cmsSlice.name,
    paymentSlice.name,
  ],

  // More info here:  https://shift.infinite.red/shipping-persistant-reducers-7341691232b1
  // transforms: [immutablePersistenceTransform],
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

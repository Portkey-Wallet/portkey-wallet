import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  ImmutableStateInvariantMiddlewareOptions,
  SerializableStateInvariantMiddlewareOptions,
} from '@reduxjs/toolkit';
import { FLUSH, PAUSE, PERSIST, PURGE, REGISTER, REHYDRATE } from 'redux-persist';
import { rampSlice } from '@portkey-wallet/store/store-ca/ramp/slice';
import chainSlice from '@portkey-wallet/store/network/slice';
import txFeeSlice from '@portkey-wallet/store/store-ca/txFee/slice';
import securitySlice from '@portkey-wallet/store/store-ca/security/slice';
import { walletSlice } from '@portkey-wallet/store/wallet/slice';
import { guardiansSlice } from '@portkey-wallet/store/store-ca/guardians/slice';
import recentSlice from '@portkey-wallet/store/store-ca/recent/slice';
import activitySlice from '@portkey-wallet/store/store-ca/activity/slice';
import assetsSlice from '@portkey-wallet/store/store-ca/assets/slice';
import settingsSlice from '@portkey-wallet/store/settings/slice';
import { tokenManagementSlice } from '@portkey-wallet/store/store-ca/tokenManagement/slice';

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
    rampSlice.name,
    chainSlice.name,
    txFeeSlice.name,
    securitySlice.name,
    guardiansSlice.name,
    recentSlice.name,
    assetsSlice.name,
    activitySlice.name,
    tokenManagementSlice.name,
    settingsSlice.name,
  ],

  // More info here:  https://shift.infinite.red/shipping-persistant-reducers-7341691232b1
  // transforms: [immutablePersistenceTransform],
};

const defaultMiddlewareOptions: DefaultMiddlewareOptions = {
  thunk: true,
  serializableCheck: {
    // https://redux-toolkit.js.org/usage/usage-guide#use-with-redux-persist
    ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
    ignoreState: true,
  },
};

export default {
  reduxPersistConfig,
  defaultMiddlewareOptions,
};

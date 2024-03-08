import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  ImmutableStateInvariantMiddlewareOptions,
  SerializableStateInvariantMiddlewareOptions,
} from '@reduxjs/toolkit';
import { FLUSH, PAUSE, PERSIST, PURGE, REGISTER, REHYDRATE } from 'redux-persist';
import { rampSlice } from '@portkey-wallet/store/store-ca/ramp/slice';

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
  whitelist: [rampSlice.name],

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

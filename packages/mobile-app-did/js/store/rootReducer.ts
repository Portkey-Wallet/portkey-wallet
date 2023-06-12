import { combineReducers } from '@reduxjs/toolkit';
import { walletSlice } from '@portkey-wallet/store/store-ca/wallet/slice';
import { contactSlice } from '@portkey-wallet/store/store-ca/contact/slice';
import chainSlice from '@portkey-wallet/store/network/slice';
import tokenSlice from '@portkey-wallet/store/token/slice';
import tokenBalanceSlice from '@portkey-wallet/store/tokenBalance/slice';
import settingsSlice from '@portkey-wallet/store/settings/slice';

import AsyncStorage from '@react-native-async-storage/async-storage';

import { persistReducer } from 'redux-persist';
import userSlice from './user/slice';
import { rateApi } from '@portkey-wallet/store/rate/api';
import { recentSlice } from '@portkey-wallet/store/store-ca/recent/slice';
import { assetsSlice } from '@portkey-wallet/store/store-ca/assets/slice';
import { tokenManagementSlice } from '@portkey-wallet/store/store-ca/tokenManagement/slice';

import { activitySlice } from '@portkey-wallet/store/store-ca/activity/slice';
import { guardiansSlice } from '@portkey-wallet/store/store-ca/guardians/slice';
import { paymentSlice } from '@portkey-wallet/store/store-ca/payment/slice';
import { discoverSlice } from '@portkey-wallet/store/store-ca/discover/slice';
import { switchSlice } from '@portkey-wallet/store/store-ca/switch/slice';
import { miscSlice } from '@portkey-wallet/store/store-ca/misc/slice';
import { dappSlice } from '@portkey-wallet/store/store-ca/dapp/slice';
import { cmsSlice } from '@portkey-wallet/store/store-ca/cms/slice';

const userPersistConfig = {
  key: userSlice.name,
  storage: AsyncStorage,
  blacklist: ['credentials'],
};
const tokenPersistConfig = {
  key: tokenSlice.name,
  storage: AsyncStorage,
  blacklist: ['tokenDataShowInMarket'],
};

const tokenBalancePersistConfig = {
  key: tokenBalanceSlice.name,
  storage: AsyncStorage,
};

const settingsPersistConfig = {
  key: settingsSlice.name,
  storage: AsyncStorage,
};

const recentPersistConfig = {
  key: recentSlice.name,
  storage: AsyncStorage,
};

const activityPersistConfig = {
  key: activitySlice.name,
  storage: AsyncStorage,
};

const assetsPersistConfig = {
  key: assetsSlice.name,
  storage: AsyncStorage,
};

const guardiansPersistConfig = {
  key: guardiansSlice.name,
  storage: AsyncStorage,
};
const discoverPersistConfig = {
  key: discoverSlice.name,
  storage: AsyncStorage,
  blacklist: ['isDrawerOpen'],
};

const paymentPersistConfig = {
  key: paymentSlice.name,
  storage: AsyncStorage,
};

export const userReducer = persistReducer(userPersistConfig, userSlice.reducer);
export const tokenReducer = persistReducer(tokenPersistConfig, tokenSlice.reducer);
export const tokenBalanceReducer = persistReducer(tokenBalancePersistConfig, tokenBalanceSlice.reducer);
export const settingsReducer = persistReducer(settingsPersistConfig, settingsSlice.reducer);
export const recentReducer = persistReducer(recentPersistConfig, recentSlice.reducer);
export const activityReducer = persistReducer(activityPersistConfig, activitySlice.reducer);
export const assetsReducer = persistReducer(assetsPersistConfig, assetsSlice.reducer);
export const guardiansReducer = persistReducer(guardiansPersistConfig, guardiansSlice.reducer);
export const paymentReducer = persistReducer(paymentPersistConfig, paymentSlice.reducer);
export const discoverReducer = persistReducer(discoverPersistConfig, discoverSlice.reducer);

const rootReducer = combineReducers({
  [userSlice.name]: userReducer,
  [walletSlice.name]: walletSlice.reducer,
  [chainSlice.name]: chainSlice.reducer,
  [tokenSlice.name]: tokenReducer,
  [contactSlice.name]: contactSlice.reducer,
  [miscSlice.name]: miscSlice.reducer,
  [guardiansSlice.name]: guardiansReducer,
  [tokenBalanceSlice.name]: tokenBalanceReducer,
  [settingsSlice.name]: settingsReducer,
  [recentSlice.name]: recentReducer,
  [rateApi.reducerPath]: rateApi.reducer,
  [assetsSlice.name]: assetsReducer,
  [activitySlice.name]: activityReducer,
  [tokenManagementSlice.name]: tokenManagementSlice.reducer,
  [paymentSlice.name]: paymentReducer,
  [discoverSlice.name]: discoverReducer,
  [switchSlice.name]: switchSlice.reducer,
  [dappSlice.name]: dappSlice.reducer,
  [cmsSlice.name]: cmsSlice.reducer,
});

export default rootReducer;

import { combineReducers } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { persistReducer } from 'redux-persist';
import userSlice from './user/slice';
import { walletSlice } from '@portkey-wallet/store/store-eoa/wallet/slice';
import { settingsSlice } from '@portkey-wallet/store/settings/slice';
import chainSlice from '@portkey-wallet/store/network/slice';
import { networkSlice } from '@portkey-wallet/store/store-eoa/network/slice';
import assetsSlice from '@portkey-wallet/store/store-eoa/assets/slice';
import tokenManagementSlice from '@portkey-wallet/store/store-eoa/tokenManagement/slice';
import activitySlice from '@portkey-wallet/store/store-eoa/activity/slice';
import awakenSlice from '@portkey-wallet/store/awaken/slice';
import { contactSlice } from '@portkey-wallet/store/store-eoa/contact/slice';
import { configSlice } from '@portkey-wallet/store/store-eoa/config/slice';
import { cmsSlice } from '@portkey-wallet/store/store-eoa/cms/slice';
import { dappSlice } from '@portkey-wallet/store/store-eoa/dapp/slice';
import discoverSlice from '@portkey-wallet/store/store-eoa/discover/slice';
import { recentSlice } from '@portkey-wallet/store/store-eoa/recent/slice';

const userPersistConfig = {
  key: userSlice.name,
  storage: AsyncStorage,
  blacklist: ['credentials'],
};
const assetsPersistConfig = {
  key: assetsSlice.name,
  storage: AsyncStorage,
  whitelist: ['localShowTokenInfo'],
};

const discoverPersistConfig = {
  key: discoverSlice.name,
  storage: AsyncStorage,
  blacklist: ['isDrawerOpen', 'initializedList', 'activeTabId', 'autoApproveMap'],
};

export const userReducer = persistReducer(userPersistConfig, userSlice.reducer);
export const assetsReducer = persistReducer(assetsPersistConfig, assetsSlice.reducer);
export const discoverReducer = persistReducer(discoverPersistConfig, discoverSlice.reducer);

const rootReducer = combineReducers({
  [userSlice.name]: userReducer,
  [walletSlice.name]: walletSlice.reducer,
  [settingsSlice.name]: settingsSlice.reducer,
  [chainSlice.name]: chainSlice.reducer,
  [networkSlice.name]: networkSlice.reducer,
  [contactSlice.name]: contactSlice.reducer,
  // [miscSlice.name]: miscSlice.reducer,
  // [guardiansSlice.name]: guardiansSlice.reducer,
  [recentSlice.name]: recentSlice.reducer,
  [assetsSlice.name]: assetsReducer,
  [activitySlice.name]: activitySlice.reducer,
  [tokenManagementSlice.name]: tokenManagementSlice.reducer,
  [dappSlice.name]: dappSlice.reducer,
  [cmsSlice.name]: cmsSlice.reducer,

  [discoverSlice.name]: discoverReducer,
  // [txFeeSlice.name]: txFeeSlice.reducer,
  // [cryptoGiftSlice.name]: cryptoGiftSlice.reducer,
  // [securitySlice.name]: securitySlice.reducer,
  // [rampSlice.name]: rampSlice.reducer,
  [awakenSlice.name]: awakenSlice.reducer,
  // [referralSlice.name]: referralSlice.reducer,
  [configSlice.name]: configSlice.reducer,
});

export default rootReducer;

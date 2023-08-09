import { combineReducers } from '@reduxjs/toolkit';
import { walletSlice } from '@portkey-wallet/store/store-ca/wallet/slice';
import { contactSlice } from '@portkey-wallet/store/store-ca/contact/slice';
import chainSlice from '@portkey-wallet/store/network/slice';
import settingsSlice from '@portkey-wallet/store/settings/slice';

import AsyncStorage from '@react-native-async-storage/async-storage';

import { persistReducer } from 'redux-persist';
import userSlice from './user/slice';
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
import { txFeeSlice } from '@portkey-wallet/store/store-ca/txFee/slice';
import imSlice from '@portkey-wallet/store/store-ca/im/slice';
import { chatSlice } from './chat/slice';

const userPersistConfig = {
  key: userSlice.name,
  storage: AsyncStorage,
  blacklist: ['credentials'],
};

const discoverPersistConfig = {
  key: discoverSlice.name,
  storage: AsyncStorage,
  blacklist: ['isDrawerOpen', 'initializedList', 'activeTabId', 'autoApproveMap'],
};

export const userReducer = persistReducer(userPersistConfig, userSlice.reducer);
export const discoverReducer = persistReducer(discoverPersistConfig, discoverSlice.reducer);

const rootReducer = combineReducers({
  [walletSlice.name]: walletSlice.reducer,
  [chainSlice.name]: chainSlice.reducer,
  [contactSlice.name]: contactSlice.reducer,
  [miscSlice.name]: miscSlice.reducer,
  [guardiansSlice.name]: guardiansSlice.reducer,
  [settingsSlice.name]: settingsSlice.reducer,
  [recentSlice.name]: recentSlice.reducer,
  [assetsSlice.name]: assetsSlice.reducer,
  [activitySlice.name]: activitySlice.reducer,
  [tokenManagementSlice.name]: tokenManagementSlice.reducer,
  [paymentSlice.name]: paymentSlice.reducer,
  [switchSlice.name]: switchSlice.reducer,
  [dappSlice.name]: dappSlice.reducer,
  [cmsSlice.name]: cmsSlice.reducer,
  [userSlice.name]: userReducer,
  [discoverSlice.name]: discoverReducer,
  [txFeeSlice.name]: txFeeSlice.reducer,
  [imSlice.name]: imSlice.reducer,
  [chatSlice.name]: chatSlice.reducer,
});

export default rootReducer;

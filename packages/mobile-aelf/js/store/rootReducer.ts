import { combineReducers } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { persistReducer } from 'redux-persist';
import userSlice from './user/slice';
import { walletSlice } from '@portkey-wallet/store/store-eoa/wallet/slice';
import { settingsSlice } from '@portkey-wallet/store/settings/slice';
import chainSlice from '@portkey-wallet/store/network/slice';

const userPersistConfig = {
  key: userSlice.name,
  storage: AsyncStorage,
  blacklist: ['credentials'],
};

// const discoverPersistConfig = {
//   key: discoverSlice.name,
//   storage: AsyncStorage,
//   blacklist: ['isDrawerOpen', 'initializedList', 'activeTabId', 'autoApproveMap'],
// };

// const imPersistConfig = {
//   key: imSlice.name,
//   storage: AsyncStorage,
//   blacklist: [
//     'channelMessageListNetMap',
//     'groupInfoMapNetMap',
//     'pinListNetMap',
//     'lastPinNetMap',
//     'sendingBotRelationIdNetMap',
//   ],
// };

export const userReducer = persistReducer(userPersistConfig, userSlice.reducer);
// export const discoverReducer = persistReducer(discoverPersistConfig, discoverSlice.reducer);
// export const imReducer = persistReducer(imPersistConfig, imSlice.reducer);

const rootReducer = combineReducers({
  [userSlice.name]: userReducer,
  [walletSlice.name]: walletSlice.reducer,
  [settingsSlice.name]: settingsSlice.reducer,
  [chainSlice.name]: chainSlice.reducer,
  // [contactSlice.name]: contactSlice.reducer,
  // [miscSlice.name]: miscSlice.reducer,
  // [guardiansSlice.name]: guardiansSlice.reducer,
  // [recentSlice.name]: recentSlice.reducer,
  // [assetsSlice.name]: assetsSlice.reducer,
  // [activitySlice.name]: activitySlice.reducer,
  // [tokenManagementSlice.name]: tokenManagementSlice.reducer,
  // [dappSlice.name]: dappSlice.reducer,
  // [cmsSlice.name]: cmsSlice.reducer,

  // [discoverSlice.name]: discoverReducer,
  // [txFeeSlice.name]: txFeeSlice.reducer,
  // [imSlice.name]: imReducer,
  // [cryptoGiftSlice.name]: cryptoGiftSlice.reducer,
  // [securitySlice.name]: securitySlice.reducer,
  // [chatSlice.name]: chatSlice.reducer,
  // [rampSlice.name]: rampSlice.reducer,
  // [awakenSlice.name]: awakenSlice.reducer,
  // [referralSlice.name]: referralSlice.reducer,
  // [configSlice.name]: configSlice.reducer,
});

export default rootReducer;

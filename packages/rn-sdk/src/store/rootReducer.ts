import { combineReducers } from '@reduxjs/toolkit';
import { persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { rampSlice } from '@portkey-wallet/store/store-ca/ramp/slice';
import chainSlice from '@portkey-wallet/store/network/slice';
import txFeeSlice from '@portkey-wallet/store/store-ca/txFee/slice';
import securitySlice from '@portkey-wallet/store/store-ca/security/slice';
import { walletSlice } from '@portkey-wallet/store/store-ca/wallet/slice';
import { guardiansSlice } from '@portkey-wallet/store/store-ca/guardians/slice';
import recentSlice from '@portkey-wallet/store/store-ca/recent/slice';
import activitySlice from '@portkey-wallet/store/store-ca/activity/slice';
import assetsSlice from '@portkey-wallet/store/store-ca/assets/slice';
import settingsSlice from '@portkey-wallet/store/settings/slice';
import { tokenManagementSlice } from '@portkey-wallet/store/store-ca/tokenManagement/slice';
import userSlice from './user/slice';

const userPersistConfig = {
  key: userSlice.name,
  storage: AsyncStorage,
  blacklist: ['credentials'],
};
export const userReducer = persistReducer(userPersistConfig, userSlice.reducer);

const rootReducer = combineReducers({
  [walletSlice.name]: walletSlice.reducer,
  [rampSlice.name]: rampSlice.reducer,
  [chainSlice.name]: chainSlice.reducer,
  [txFeeSlice.name]: txFeeSlice.reducer,
  [securitySlice.name]: securitySlice.reducer,
  [userSlice.name]: userReducer,
  [guardiansSlice.name]: guardiansSlice.reducer,
  [recentSlice.name]: recentSlice.reducer,
  [activitySlice.name]: activitySlice.reducer,
  [assetsSlice.name]: assetsSlice.reducer,
  [settingsSlice.name]: settingsSlice.reducer,
  [tokenManagementSlice.name]: tokenManagementSlice.reducer,
});

export default rootReducer;

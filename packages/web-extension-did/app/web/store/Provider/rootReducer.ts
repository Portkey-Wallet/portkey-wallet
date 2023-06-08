import { walletSlice } from '@portkey-wallet/store/store-ca/wallet/slice';
import { loginSlice } from 'store/reducers/loginCache/slice';
import { contactSlice } from '@portkey-wallet/store/store-ca/contact/slice';
import userReducer, { userSlice } from 'store/reducers/user/slice';
import tokenBalanceSlice from '@portkey-wallet/store/tokenBalance/slice';
import chainSlice from '@portkey-wallet/store/network/slice';
import tokenSlice from '@portkey-wallet/store/store-ca/tokenManagement/slice';
import assetsSlice from '@portkey-wallet/store/store-ca/assets/slice';
import activitySlice from '@portkey-wallet/store/store-ca/activity/slice';
import recentSlice from '@portkey-wallet/store/store-ca/recent/slice';
import ModalSlice from 'store/reducers/modal/slice';
import CommonSlice from 'store/reducers/common/slice';
import { customCombineReducers } from 'store/utils/customCombineReducers';
import { persistReducer } from 'redux-persist';
import {
  loginPersistConfig,
  tokenPersistConfig,
  walletPersistConfig,
  contactPersistConfig,
  guardiansPersistConfig,
  activityPersistConfig,
  recentPersistConfig,
  assetPersistConfig,
  miscPersistConfig,
  paymentPersistConfig,
  cmsPersistConfig,
  dappPersistConfig,
} from './config';
import { miscSlice } from '@portkey-wallet/store/store-ca/misc/slice';
import { guardiansSlice } from '@portkey-wallet/store/store-ca/guardians/slice';
import { paymentSlice } from '@portkey-wallet/store/store-ca/payment/slice';
import { cmsSlice } from '@portkey-wallet/store/store-ca/cms/slice';
import { dappSlice } from '@portkey-wallet/store/store-ca/dapp/slice';

export const tokenReducer = persistReducer(tokenPersistConfig, tokenSlice.reducer);
export const assetReducer = persistReducer(assetPersistConfig, assetsSlice.reducer);
export const activityReducer = persistReducer(activityPersistConfig, activitySlice.reducer);
export const recentReducer = persistReducer(recentPersistConfig, recentSlice.reducer);
export const walletReducer = persistReducer(walletPersistConfig, walletSlice.reducer);
export const loginReducer = persistReducer(loginPersistConfig, loginSlice.reducer);
export const guardiansReducer = persistReducer(guardiansPersistConfig, guardiansSlice.reducer);
export const contactReducer = persistReducer(contactPersistConfig, contactSlice.reducer);
export const miscReducer = persistReducer(miscPersistConfig, miscSlice.reducer);
export const paymentReducer = persistReducer(paymentPersistConfig, paymentSlice.reducer);
export const cmsReducer = persistReducer(cmsPersistConfig, cmsSlice.reducer);
export const dappReducer = persistReducer(dappPersistConfig, dappSlice.reducer);

const rootReducer = customCombineReducers({
  [walletSlice.name]: walletReducer,
  [loginSlice.name]: loginReducer,
  [guardiansSlice.name]: guardiansReducer,
  [contactSlice.name]: contactReducer,
  [userSlice.name]: userReducer,
  [tokenBalanceSlice.name]: tokenBalanceSlice.reducer,
  [chainSlice.name]: chainSlice.reducer,
  [tokenSlice.name]: tokenReducer,
  [activitySlice.name]: activityReducer,
  [recentSlice.name]: recentReducer,
  [ModalSlice.name]: ModalSlice.reducer,
  [CommonSlice.name]: CommonSlice.reducer,
  [assetsSlice.name]: assetReducer,
  [miscSlice.name]: miscReducer,
  [paymentSlice.name]: paymentReducer,
  [cmsSlice.name]: cmsReducer,
  [dappSlice.name]: dappReducer,
});

export default rootReducer;

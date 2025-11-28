import { Action, configureStore, ThunkAction } from '@reduxjs/toolkit';
import { persistReducer } from 'redux-persist';
import storeConfig from './config';
import rootReducer from './rootReducer';
import { rateApi } from '@portkey-wallet/store/rate/api';
import { DappMiddle } from '@portkey-wallet/utils/dapp/middle';
const persistedReducer = persistReducer(storeConfig.reduxPersistConfig, rootReducer);

const middlewareList: any[] = [];
middlewareList.push(rateApi.middleware);

// dapp middle
middlewareList.push(DappMiddle.middle);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware => getDefaultMiddleware(storeConfig.defaultMiddlewareOptions).concat(middlewareList),
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action<string>>;

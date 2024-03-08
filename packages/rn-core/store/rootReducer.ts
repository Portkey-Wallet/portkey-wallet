import { combineReducers } from '@reduxjs/toolkit';
import { rampSlice } from '@portkey-wallet/store/store-ca/ramp/slice';

const rootReducer = combineReducers({
  [rampSlice.name]: rampSlice.reducer,
});

export default rootReducer;

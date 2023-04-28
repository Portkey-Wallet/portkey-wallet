import { DefaultCountry } from '@portkey-wallet/constants/constants-ca/country';
import { createSlice } from '@reduxjs/toolkit';
import {
  setLoginAccountAction,
  resetLoginInfoAction,
  setWalletInfoAction,
  setRegisterVerifierAction,
  setCountryCodeAction,
} from './actions';
import { LoginState } from './type';

const initialState: LoginState = {
  countryCode: {
    index: DefaultCountry.country[0],
    country: DefaultCountry,
  },
};

export const loginSlice = createSlice({
  name: 'loginCache',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(setLoginAccountAction, (state, action) => {
        state.loginAccount = action.payload;
      })
      .addCase(setWalletInfoAction, (state, action) => {
        const { walletInfo, caWalletInfo } = action.payload;
        state.scanWalletInfo = walletInfo;
        state.scanCaWalletInfo = caWalletInfo;
      })
      .addCase(setRegisterVerifierAction, (state, action) => {
        state.registerVerifier = action.payload;
      })
      .addCase(setCountryCodeAction, (state, action) => {
        state.countryCode = action.payload;
      })
      .addCase(resetLoginInfoAction, () => ({ ...initialState }));
  },
});

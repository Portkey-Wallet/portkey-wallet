import { createSlice } from '@reduxjs/toolkit';
import { setLoginAccountAction, resetLoginInfoAction, setWalletInfoAction, setRegisterVerifierAction } from './actions';
import { LoginState } from './type';

const initialState: LoginState = {};

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
      .addCase(resetLoginInfoAction, () => ({ ...initialState }));
  },
});

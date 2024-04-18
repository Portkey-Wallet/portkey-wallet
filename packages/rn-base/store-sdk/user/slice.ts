import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserStoreState } from './types';

const initialState: UserStoreState = {};
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<UserStoreState['credentials']>) => {
      state.credentials = action.payload;
      console.log('wfs setCredentials state', state);
      console.log('wfs setCredentials', action.payload);
    },
    setBiometrics: (state, action: PayloadAction<UserStoreState['biometrics']>) => {
      state.biometrics = action.payload;
      console.log('state biometrics is', state.biometrics);
    },
    resetUser: () => initialState,
  },
});

export default userSlice;

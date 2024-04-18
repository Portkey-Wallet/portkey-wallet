import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserStoreState } from './types';

const initialState: UserStoreState = {};
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<UserStoreState['credentials']>) => {
      state.credentials = action.payload;
    },
    setBiometrics: (state, action: PayloadAction<UserStoreState['biometrics']>) => {
      state.biometrics = action.payload;
    },
    resetUser: () => initialState,
  },
});

export default userSlice;

import { OpacityType } from '@portkey-wallet/types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface LoadingInfo {
  isLoading?: boolean | OpacityType;
  loadingText?: string;
  isEllipsis?: boolean;
}

export interface UserState {
  passwordSeed: string;
  loadingInfo: LoadingInfo;
}

export const initialState: UserState = {
  passwordSeed: '',
  loadingInfo: {
    isLoading: false,
    loadingText: 'Loading...',
    isEllipsis: true,
  },
};

//it automatically uses the immer library to let you write simpler immutable updates with normal mutative code
export const userSlice = createSlice({
  name: 'userInfo',
  initialState,
  reducers: {
    setPasswordSeed: (state, action: PayloadAction<string>) => {
      state.passwordSeed = action.payload;
    },
    setGlobalLoading: (state, action: PayloadAction<LoadingInfo>) => {
      state.loadingInfo = action.payload;
    },
  },
});

export const { setPasswordSeed, setGlobalLoading } = userSlice.actions;

export default userSlice.reducer;

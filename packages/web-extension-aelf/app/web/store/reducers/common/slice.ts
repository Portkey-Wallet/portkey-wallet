import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface CommonState {
  isPrompt: boolean;
  isPopupInit: boolean;
  isNotLessThan768: boolean;
}

export const initialState: CommonState = {
  isPrompt: false,
  isPopupInit: true,
  isNotLessThan768: false,
};

//it automatically uses the immer library to let you write simpler immutable updates with normal mutative code
export const CommonSlice = createSlice({
  name: 'common',
  initialState,
  reducers: {
    setIsPrompt: (state, action: PayloadAction<boolean>) => {
      state.isPrompt = action.payload;
    },
    setIsPopupInit: (state, action: PayloadAction<boolean>) => {
      state.isPopupInit = action.payload;
    },
    setIsNotLessThan768: (state, action: PayloadAction<boolean>) => {
      state.isNotLessThan768 = action.payload;
    },
  },
});

export const { setIsPrompt, setIsPopupInit, setIsNotLessThan768 } = CommonSlice.actions;

export default CommonSlice;

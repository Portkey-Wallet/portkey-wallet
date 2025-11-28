import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface ModalState {
  countryCodeModal: boolean;
  accountConnectModal: boolean;
}

export const initialState: ModalState = {
  countryCodeModal: false,
  accountConnectModal: false,
};

//it automatically uses the immer library to let you write simpler immutable updates with normal mutative code
export const ModalSlice = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    setAccountConnectModal: (state, action: PayloadAction<boolean>) => {
      state.accountConnectModal = action.payload;
    },
    setCountryModal: (state, action: PayloadAction<boolean>) => {
      state.countryCodeModal = action.payload;
    },
  },
});

export const { setAccountConnectModal, setCountryModal } = ModalSlice.actions;

export default ModalSlice;

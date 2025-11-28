import { createSlice } from '@reduxjs/toolkit';
import { ReferralStateType } from './type';

const initialState: ReferralStateType = {
  viewReferralStatusMap: {},
  referralLinkMap: {},
};

export const referralSlice = createSlice({
  name: 'referral',
  initialState,
  reducers: {
    setViewReferralStatusLocal: (state, { payload }) => {
      const { network, value } = payload;

      state.viewReferralStatusMap = {
        ...state.viewReferralStatusMap,
        [network]: value,
      };
    },
    setReferralLinkLocal: (state, { payload }) => {
      const { network, value } = payload;

      state.referralLinkMap = {
        ...state.referralLinkMap,
        [network]: value,
      };
    },
    resetReferral: () => initialState,
  },
});

export const { setViewReferralStatusLocal, setReferralLinkLocal, resetReferral } = referralSlice.actions;

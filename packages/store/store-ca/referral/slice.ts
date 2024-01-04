import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { ReferralStateType, RedDotsType } from './type';
import { request } from '@portkey-wallet/api/api-did';
import { NetworkType } from '@portkey-wallet/types';

const initialState: ReferralStateType = {
  viewReferralStatusMap: {},
  referralLinkMap: {},
};

export const fetchViewReferralStatusAsync = createAsyncThunk(
  'fetchViewReferralStatusAsync',
  async (network: NetworkType) => {
    const redDotsStatusArr = await request.referral.getReferralRedDotsStatus();

    return {
      network,
      value: redDotsStatusArr?.find(
        (item: { type: RedDotsType; status: string | number }) => item?.type === RedDotsType.REFERRAL,
      )?.status,
    };
  },
);

export const fetchReferralLinkAsync = createAsyncThunk('fetchReferralLinkAsync', async (network: NetworkType) => {
  const result = await request.referral.getReferralShortLink({
    params: {
      // todo: change projectCode
      projectCode: '0',
    },
  });
  return {
    network,
    value: result?.shortLink,
  };
});

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
  },
  extraReducers: builder => {
    builder
      .addCase(fetchViewReferralStatusAsync.fulfilled, (state, action) => {
        const { network, value } = action.payload;

        state.viewReferralStatusMap = {
          ...state.viewReferralStatusMap,
          [network]: value,
        };
      })
      .addCase(fetchReferralLinkAsync.fulfilled, (state, action) => {
        const { network, value } = action.payload;

        state.referralLinkMap = {
          ...state.referralLinkMap,
          [network]: value,
        };
      });
  },
});

export const { setViewReferralStatusLocal } = referralSlice.actions;

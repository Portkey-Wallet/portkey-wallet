import { createSlice } from '@reduxjs/toolkit';

import { IMStateType } from './type';
import { nextChannelList, resetIm, setChannelList, setHasNext } from './actions';

const initialState: IMStateType = {
  channelListNetMap: {},
  hasNextNetMap: {},
};
export const imSlice = createSlice({
  name: 'im',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(setChannelList, (state, action) => {
        return {
          ...state,
          channelListNetMap: {
            ...state.channelListNetMap,
            [action.payload.network]: action.payload.channelList,
          },
        };
      })
      .addCase(nextChannelList, (state, action) => {
        const originList = state.channelListNetMap[action.payload.network]?.list || [];
        const chanelList = {
          list: [...originList, ...action.payload.channelList.list],
          cursor: action.payload.channelList.cursor,
        };
        return {
          ...state,
          channelListNetMap: {
            ...state.channelListNetMap,
            [action.payload.network]: chanelList,
          },
        };
      })
      .addCase(setHasNext, (state, action) => {
        return {
          ...state,
          hasNextNetMap: {
            ...state.hasNextNetMap,
            [action.payload.network]: action.payload.hasNext,
          },
        };
      })
      .addCase(resetIm, (state, action) => {
        return {
          ...state,
          channelListNetMap: {
            ...state.channelListNetMap,
            [action.payload]: undefined,
          },
          hasNextNetMap: {
            ...state.hasNextNetMap,
            [action.payload]: undefined,
          },
        };
      });
  },
});

export default imSlice;

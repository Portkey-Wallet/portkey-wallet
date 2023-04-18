import { createSlice } from '@reduxjs/toolkit';
import { IRecordsItemType } from '@portkey-wallet/types/types-ca/discover';
import { DiscoverStateType } from './type';

const initialState: DiscoverStateType = {
  recordsList: [],
  tabs: [],
};

//it automatically uses the immer library to let you write simpler immutable updates with normal mutative code
export const discoverSlice = createSlice({
  name: 'discover',
  initialState,
  reducers: {
    addRecordsItem: (state, { payload }: { payload: IRecordsItemType }) => {
      const targetItem = state.recordsList.find(item => item.url === payload.url);

      if (targetItem) {
        const arr = state.recordsList.filter(item => item.url !== payload.url);
        arr.push(targetItem);
        state.recordsList = arr;
      } else {
        state.recordsList.push({ ...payload });
      }
    },
    upDateRecordsItem: (state, { payload }: { payload: IRecordsItemType }) => {
      console.log('store', [
        ...state.recordsList.map(item => {
          return item.url === payload.url ? { ...item, ...payload } : item;
        }),
      ]);

      state.recordsList = state.recordsList.map(item => {
        return item.url === payload.url ? { ...item, ...payload } : item;
      });
    },
    clearRecordsList: state => {
      state.recordsList = [];
    },
    resetDiscover: () => initialState,
  },
});

export const { addRecordsItem, upDateRecordsItem, clearRecordsList, resetDiscover } = discoverSlice.actions;

export default discoverSlice;

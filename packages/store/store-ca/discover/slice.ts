import { createSlice } from '@reduxjs/toolkit';
import { IRecordsItemType } from '@portkey-wallet/types/types-ca/discover';
import { IDiscoverStateType } from './type';

const initialState: IDiscoverStateType = {
  isDrawerOpen: false,
  recordsList: [],
  whiteList: [],
  activeTabId: -1,
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
    closeAllTabs: (state, { payload }) => {
      state.tabs = [];
      state.activeTabId = -1;
      console.log('closeAllTabs', payload);
    },
    createNewTab: (state, { payload }) => {
      state.activeTabId = payload.id;
      state.tabs.push(payload);
      console.log('createNewTab', payload);
    },
    closeExistingTab: (state, { payload }) => {
      state.tabs = state.tabs.filter(item => item.id !== payload);
    },
    setActiveTab: (state, { payload }) => {
      state.activeTabId = payload;
    },
    updateTab: (state, { payload }) => {
      state.tabs = state.tabs.map(item => (item.id === payload.id ? { ...item, ...payload } : item));
    },
    changeDrawerOpenStatus: (state, { payload }) => {
      console.log('payload', payload);
      state.isDrawerOpen = payload;
    },
    resetDiscover: () => initialState,
  },
});

export const {
  addRecordsItem,
  upDateRecordsItem,
  clearRecordsList,
  resetDiscover,
  closeAllTabs,
  createNewTab,
  closeExistingTab,
  setActiveTab,
  updateTab,
  changeDrawerOpenStatus,
} = discoverSlice.actions;

export default discoverSlice;

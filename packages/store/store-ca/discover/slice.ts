import { createSlice } from '@reduxjs/toolkit';
import { IDiscoverStateType, IDiscoverNetworkStateType, ITabItem } from './type';
import { NetworkType } from '@portkey-wallet/types';
import { enableMapSet } from 'immer';
import { RECORD_LIMIT, TAB_LIMIT } from '@portkey-wallet/constants/constants-ca/discover';

enableMapSet();
const initNetworkData: IDiscoverNetworkStateType = {
  recordsList: [],
  whiteList: [],
  tabs: [],
};

const initialState: IDiscoverStateType = {
  isDrawerOpen: false,
  discoverMap: {},
  activeTabId: undefined,
  initializedList: new Set<number>(),
};

//it automatically uses the immer library to let you write simpler immutable updates with normal mutative code
export const discoverSlice = createSlice({
  name: 'discover',
  initialState,
  reducers: {
    initNetworkDiscoverMap: (state, { payload }: { payload: NetworkType }) => {
      state.discoverMap = {
        ...(state.discoverMap || {}),
        [payload]: JSON.parse(JSON.stringify(initNetworkData)),
      };
    },
    addRecordsItem: (state, { payload }: { payload: ITabItem & { networkType: NetworkType } }) => {
      const { networkType, url } = payload;
      if (!state.discoverMap) return;

      if (!state.discoverMap?.[networkType]) state.discoverMap[networkType] = initNetworkData;

      const targetItem = state.discoverMap?.[networkType]?.recordsList.find(item => item.url === url);
      const targetNetworkDiscover = state.discoverMap?.[networkType] || ({} as IDiscoverNetworkStateType);

      // limit number
      if (RECORD_LIMIT <= targetNetworkDiscover.recordsList.length) {
        targetNetworkDiscover.tabs.shift();
      }

      if (targetItem) {
        const arr = state.discoverMap?.[networkType]?.recordsList.filter(item => item.url !== url) || [];
        arr.push(targetItem);
        targetNetworkDiscover.recordsList = arr;
      } else {
        targetNetworkDiscover.recordsList.push({ ...payload });
      }
    },
    upDateRecordsItem: (state, { payload }: { payload: ITabItem & { networkType: NetworkType } }) => {
      const { networkType } = payload;
      const targetNetworkDiscover = state.discoverMap?.[networkType] || ({} as IDiscoverNetworkStateType);

      targetNetworkDiscover.recordsList = targetNetworkDiscover?.recordsList.map(item => {
        return item.url === payload.url ? { ...item, ...payload } : item;
      });
    },
    clearRecordsList: (state, { payload }: { payload: { networkType: NetworkType } }) => {
      const { networkType } = payload;
      const targetNetworkDiscover = state.discoverMap?.[networkType] || ({} as IDiscoverNetworkStateType);

      targetNetworkDiscover.recordsList = [];
    },
    closeAllTabs: (state, { payload }: { payload: { networkType: NetworkType } }) => {
      const { networkType } = payload;
      const targetNetworkDiscover = state.discoverMap?.[networkType] || ({} as IDiscoverNetworkStateType);

      targetNetworkDiscover.tabs = [];
      state.activeTabId = undefined;
    },
    createNewTab: (state, { payload }: { payload: ITabItem & { networkType: NetworkType } }) => {
      const { networkType, id } = payload;
      const targetNetworkDiscover = state.discoverMap?.[networkType] || ({} as IDiscoverNetworkStateType);

      if (!targetNetworkDiscover?.tabs) {
        targetNetworkDiscover.tabs = [{ ...payload }];
      } else {
        if (TAB_LIMIT <= targetNetworkDiscover.tabs.length) {
          targetNetworkDiscover.tabs.shift();
        }
        targetNetworkDiscover.tabs.push({ ...payload });
      }

      state.activeTabId = id;
    },
    closeExistingTab: (state, { payload }: { payload: { id: number; networkType: NetworkType } }) => {
      const { networkType, id } = payload;
      const targetNetworkDiscover = state.discoverMap?.[networkType] || ({} as IDiscoverNetworkStateType);

      targetNetworkDiscover.tabs = targetNetworkDiscover.tabs.filter(item => item.id !== id);
    },
    setActiveTab: (state, { payload }: { payload: { id: number | undefined; networkType: NetworkType } }) => {
      const { id } = payload;
      if (!state.initializedList) state.initializedList = new Set<number>();
      id && state.initializedList.add(id);
      state.activeTabId = id;
    },
    updateTab: (state, { payload }: { payload: { networkType: NetworkType; id: number; [key: string]: any } }) => {
      const { networkType, id } = payload;
      const targetNetworkDiscover = state.discoverMap?.[networkType] || ({} as IDiscoverNetworkStateType);

      targetNetworkDiscover.tabs = targetNetworkDiscover.tabs.map(item =>
        item.id === id ? { ...item, ...payload } : item,
      );
    },
    changeDrawerOpenStatus: (state, { payload }) => {
      state.isDrawerOpen = payload;
    },
    resetDiscover: (state, { payload }: { payload: NetworkType }) => {
      state.discoverMap = {
        ...(state.discoverMap || {}),
        [payload]: JSON.parse(JSON.stringify(initNetworkData)),
      };
    },
  },
});

export const {
  initNetworkDiscoverMap,
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

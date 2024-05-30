import { createSlice } from '@reduxjs/toolkit';
import {
  IDiscoverStateType,
  IDiscoverNetworkStateType,
  ITabItem,
  IBookmarkItem,
  ICryptoCurrencyItem,
  IMarketType,
  IMarketSortAndDir,
} from './type';
import { NetworkType } from '@portkey-wallet/types';
import { enableMapSet } from 'immer';
import { RECORD_LIMIT, TAB_LIMIT } from '@portkey-wallet/constants/constants-ca/discover';

enableMapSet();
const initNetworkData: IDiscoverNetworkStateType = {
  recordsList: [],
  whiteList: [],
  tabs: [],
  bookmarkList: [],
  marketInfo: {
    type: 'Hot',
    sort: '',
    sortDir: '',
    dataList: [],
  },
  preMarketInfo: {
    sort: '',
    sortDir: '',
  },
};

const initialState: IDiscoverStateType = {
  isDrawerOpen: false,
  discoverMap: {},
  activeTabId: undefined,
  initializedList: new Set<number>(),
  disclaimerConfirmedMap: {},
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
    addUrlToWhiteList: (state, { payload }: { payload: { url: string; networkType: NetworkType } }) => {
      state.discoverMap?.[payload.networkType]?.whiteList.push(payload.url);
    },
    addRecordsItem: (state, { payload }: { payload: ITabItem & { networkType: NetworkType } }) => {
      const { networkType, url } = payload;

      if (!state?.discoverMap) state.discoverMap = {};

      if (!state?.discoverMap?.[networkType]) state.discoverMap[networkType] = initNetworkData;

      const targetItem = state.discoverMap?.[networkType]?.recordsList?.find(item => item.url === url);
      const targetNetworkDiscover = state?.discoverMap?.[networkType] || ({} as IDiscoverNetworkStateType);

      // limit number
      if (RECORD_LIMIT <= targetNetworkDiscover?.recordsList.length) {
        targetNetworkDiscover?.recordsList.shift();
      }

      if (targetItem) {
        const arr = state.discoverMap?.[networkType]?.recordsList?.filter(item => item.url !== url) || [];
        arr.push(targetItem);
        targetNetworkDiscover.recordsList = arr;
      } else {
        targetNetworkDiscover.recordsList.push({ ...payload });
      }
    },
    upDateRecordsItem: (state, { payload }: { payload: ITabItem & { networkType: NetworkType } }) => {
      const { networkType } = payload;
      const targetNetworkDiscover = state.discoverMap?.[networkType] || ({} as IDiscoverNetworkStateType);

      targetNetworkDiscover.recordsList = targetNetworkDiscover?.recordsList?.map(item => {
        return item.url === payload.url ? { ...item, ...payload } : item;
      });
    },
    removeRecordsItems: (state, { payload }: { payload: { ids: number[]; networkType: NetworkType } }) => {
      const { networkType, ids = [] } = payload;
      const targetNetworkDiscover = state.discoverMap?.[networkType] || ({} as IDiscoverNetworkStateType);

      const idsObj: { [key: number]: number } = {};
      ids.forEach(id => {
        idsObj[id] = id;
      });

      targetNetworkDiscover.recordsList = targetNetworkDiscover?.recordsList?.filter(ele => !idsObj?.[ele?.id]);
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
          targetNetworkDiscover?.tabs?.shift();
        }
        targetNetworkDiscover?.tabs?.push({ ...payload });
      }

      state.activeTabId = id;
    },
    closeExistingTab: (state, { payload }: { payload: { id: number; networkType: NetworkType } }) => {
      const { networkType, id } = payload;
      const targetNetworkDiscover = state.discoverMap?.[networkType] || ({} as IDiscoverNetworkStateType);

      targetNetworkDiscover.tabs = targetNetworkDiscover?.tabs?.filter(item => item.id !== id);
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

      targetNetworkDiscover.tabs = targetNetworkDiscover?.tabs?.map(item =>
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
    cleanBookmarkList: (state, { payload }: { payload: NetworkType }) => {
      state.discoverMap = {
        ...(state.discoverMap || {}),
        [payload]: {
          ...(state.discoverMap?.[payload] || {}),
          bookmarkList: [],
        },
      };
    },
    addBookmarkList: (state, { payload }: { payload: { networkType: NetworkType; list: IBookmarkItem[] } }) => {
      const preBookmarkList = state.discoverMap?.[payload.networkType]?.bookmarkList || [];
      state.discoverMap = {
        ...(state.discoverMap || {}),
        [payload.networkType]: {
          ...(state.discoverMap?.[payload.networkType] || {}),
          bookmarkList: preBookmarkList.concat(payload.list),
        },
      };
    },
    addAutoApproveItem: (state, { payload }: { payload: number }) => {
      if (!state.autoApproveMap) state.autoApproveMap = {};
      state.autoApproveMap = { ...state.autoApproveMap, [payload]: true };
    },
    removeAutoApproveItem: (state, { payload }: { payload: number }) => {
      if (!state.autoApproveMap) state.autoApproveMap = {};
      if (state.autoApproveMap[payload]) delete state.autoApproveMap[payload];
    },
    addDisclaimerConfirmedDapp: (state, { payload }: { payload: { networkType: NetworkType; dappDomain: string } }) => {
      const preDisclaimerConfirmedArray: string[] = state.disclaimerConfirmedMap?.[payload.networkType] || [];
      preDisclaimerConfirmedArray.push(payload.dappDomain);

      console.log('state.disclaimerConfirmedMap', state.disclaimerConfirmedMap);

      state.disclaimerConfirmedMap = {
        ...(state.disclaimerConfirmedMap || {}),
        [payload.networkType]: Array.from(new Set(preDisclaimerConfirmedArray)),
      };
    },
    resetDisclaimerConfirmedDapp: (state, { payload }: { payload: NetworkType }) => {
      state.disclaimerConfirmedMap = {
        ...(state.disclaimerConfirmedMap || {}),
        [payload]: [],
      };
    },
    changeMarketType: (state, { payload }: { payload: { networkType: NetworkType; marketType: IMarketType } }) => {
      console.log('wfs=== changeMarketType before', state.discoverMap);
      state.discoverMap = {
        ...(state.discoverMap || {}),
        [payload.networkType]: {
          ...(state.discoverMap?.[payload.networkType] || {}),
          marketInfo: { ...(state.discoverMap?.[payload.networkType]?.marketInfo || {}), type: payload.marketType },
        },
      };
      console.log('wfs=== changeMarketType after', state.discoverMap);
    },
    changeMarketSort: (state, { payload }: { payload: { networkType: NetworkType; markSort: IMarketSortAndDir } }) => {
      console.log('wfs=== changeMarketSort before', state.discoverMap);
      const marketInfo = state.discoverMap?.[payload.networkType]?.marketInfo;
      const preMarketInfo = { sort: marketInfo?.sort, sortDir: marketInfo?.sortDir };
      state.discoverMap = {
        ...(state.discoverMap || {}),
        [payload.networkType]: {
          ...(state.discoverMap?.[payload.networkType] || {}),
          preMarketInfo,
          marketInfo: { ...(state.discoverMap?.[payload.networkType]?.marketInfo || {}), ...payload.markSort },
        },
      };
      console.log('wfs=== changeMarketSort after', state.discoverMap);
    },
    changeMarketList: (
      state,
      { payload }: { payload: { networkType: NetworkType; cryptoCurrencyList: ICryptoCurrencyItem[] } },
    ) => {
      console.log('wfs=== changeMarketList before', state.discoverMap);
      state.discoverMap = {
        ...(state.discoverMap || {}),
        [payload.networkType]: {
          ...(state.discoverMap?.[payload.networkType] || {}),
          marketInfo: {
            ...(state.discoverMap?.[payload.networkType]?.marketInfo || {}),
            dataList: payload.cryptoCurrencyList,
          },
        },
      };
      console.log('wfs=== changeMarketList after', state.discoverMap);
    },
    rollBackMarketSort: (state, { payload }: { payload: { networkType: NetworkType } }) => {
      console.log('wfs=== rollBackMarketSort before', state.discoverMap);
      state.discoverMap = {
        ...(state.discoverMap || {}),
        [payload.networkType]: {
          ...(state.discoverMap?.[payload.networkType] || {}),
          marketInfo: {
            ...(state.discoverMap?.[payload.networkType]?.marketInfo || {}),
            ...state.discoverMap?.[payload.networkType]?.preMarketInfo,
          },
        },
      };
      console.log('wfs=== rollBackMarketSort after', state.discoverMap);
    },
    resetMarketSort: (state, { payload }: { payload: { networkType: NetworkType } }) => {
      console.log('wfs=== resetMarketSort before', state.discoverMap);
      state.discoverMap = {
        ...(state.discoverMap || {}),
        [payload.networkType]: {
          ...(state.discoverMap?.[payload.networkType] || {}),
          marketInfo: {
            ...(state.discoverMap?.[payload.networkType]?.marketInfo || {}),
            sort: '',
            sortDir: '',
          },
        },
      };
      console.log('wfs=== resetMarketSort after', state.discoverMap);
    },
  },
});

export const {
  initNetworkDiscoverMap,
  addUrlToWhiteList,
  addRecordsItem,
  upDateRecordsItem,
  removeRecordsItems,
  clearRecordsList,
  resetDiscover,
  closeAllTabs,
  createNewTab,
  closeExistingTab,
  setActiveTab,
  updateTab,
  changeDrawerOpenStatus,
  cleanBookmarkList,
  addBookmarkList,
  addAutoApproveItem,
  removeAutoApproveItem,
  addDisclaimerConfirmedDapp,
  resetDisclaimerConfirmedDapp,
  changeMarketType,
  changeMarketSort,
  changeMarketList,
  rollBackMarketSort,
  resetMarketSort,
} = discoverSlice.actions;

export default discoverSlice;

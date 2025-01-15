import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RecentStateType, IRecentItem } from './type';
import { ChainId, NetworkType } from '@portkey-wallet/types';
import { fetchRecentTransactionUsers } from './api';
import { RECENT_LIST_PAGE_SIZE } from '@portkey-wallet/constants/constants-ca/recent';
// import { initialRecentData } from '@portkey-wallet/hooks/hooks-ca/useRecent';

export const initialRecentData = {
  isFetching: false,
  skipCount: 0,
  maxResultCount: 10,
  totalRecordCount: 0,
  recentContactList: [],
};
// TODO: BACK TO 100
const MAX_RECENT_COUNT = 5;

export const initialState: RecentStateType = {
  recentMap: {},
};

export const fetchRecentListAsync = createAsyncThunk(
  'fetchRecentListAsync',
  async (
    {
      caAddress,
      caAddressInfos,
      isFirstTime = true,
    }: {
      caAddress: string;
      isFirstTime: boolean;
      caAddressInfos: { chainId: ChainId; chainName: string; caAddress: string }[];
    },
    { getState },
  ) => {
    const { recent } = getState() as { recent: RecentStateType };
    const { skipCount = 0 } = recent?.[caAddress] || {};

    const response = await fetchRecentTransactionUsers({
      caAddressInfos,
      skipCount: isFirstTime ? 0 : skipCount,
      maxResultCount: RECENT_LIST_PAGE_SIZE,
    });

    return { isFirstTime, caAddress, response };
  },
);

export const recentSlice = createSlice({
  name: 'recent',
  initialState,
  reducers: {
    initCurrentChainRecentData: (
      state,
      action: PayloadAction<{
        caAddress: string;
      }>,
    ) => {
      const { caAddress } = action.payload;
      state[caAddress] = initialRecentData;
    },
    addRecentItem: (
      state,
      action: PayloadAction<{
        recentItem: IRecentItem;
        network: NetworkType;
      }>,
    ) => {
      const { network, recentItem } = action.payload;

      const targetList = [...(state.recentMap?.[network] || [])];

      const existingIndex = targetList.findIndex(ele => {
        return recentItem.network && recentItem.network !== 'aelf'
          ? ele.address === recentItem.address && ele.network === recentItem.network
          : ele.address === recentItem.address && ele.chainId === recentItem.chainId;
      });

      if (existingIndex !== -1) {
        const [existingItem] = targetList.splice(existingIndex, 1);
        existingItem.transferTime = recentItem.transferTime;
        targetList.unshift(existingItem);
      } else {
        targetList.unshift(recentItem);
        targetList.length > MAX_RECENT_COUNT && targetList.pop();
      }

      state.recentMap = {
        ...state.recentMap,
        [network]: targetList,
      };
    },
    resetTargetNetworkRecent: (state, action: PayloadAction<NetworkType>) => {
      state.recentMap = {
        ...state.recentMap,
        [action.payload]: [],
      };
    },
    resetRecent: () => initialState,
  },
  extraReducers: builder => {
    builder.addCase(fetchRecentListAsync.fulfilled, (state, action) => {
      const { caAddress, isFirstTime, response } = action.payload;

      const targetData = state?.[caAddress] ?? {};
      targetData.isFetching = false;
      targetData.totalRecordCount = response?.totalRecordCount;
      targetData.skipCount += RECENT_LIST_PAGE_SIZE;

      if (isFirstTime) {
        // first Page
        targetData.skipCount = RECENT_LIST_PAGE_SIZE;
        targetData.recentContactList = response.data;
      } else {
        targetData.recentContactList = [...targetData.recentContactList, ...response.data];
      }

      state[caAddress] = targetData;
    });
  },
});

export const { initCurrentChainRecentData, addRecentItem, resetRecent, resetTargetNetworkRecent } = recentSlice.actions;

export default recentSlice;

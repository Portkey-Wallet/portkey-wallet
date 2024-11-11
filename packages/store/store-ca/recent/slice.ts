import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { RecentStateType, IRecentItem } from './type';
import { ChainId, NetworkType } from '@portkey-wallet/types';

const MAX_RECENT_COUNT = 100;

export const initialState: RecentStateType = {
  recentMap: {},
};

export const recentSlice = createSlice({
  name: 'recent',
  initialState,
  reducers: {
    addRecentItem: (
      state,
      action: PayloadAction<{
        chainId: ChainId;
        tokenId: string; // ft is symbol, nft is nft
        recentItem: IRecentItem;
        network: NetworkType;
      }>,
    ) => {
      const { chainId, tokenId, network, recentItem } = action.payload;
      const id = `${chainId}-${tokenId}`;
      const targetList = [...(state.recentMap?.[network]?.[id] || [])];

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
        [network]: {
          ...state.recentMap[network],
          [id]: targetList,
        },
      };
    },
    resetTargetNetworkRecent: (
      state,
      action: PayloadAction<{
        network: NetworkType;
      }>,
    ) => {
      const { network } = action.payload;
      state.recentMap = {
        ...state.recentMap,
        [network]: {},
      };
    },
    resetRecent: () => initialState,
  },
});

export const { addRecentItem, resetRecent, resetTargetNetworkRecent } = recentSlice.actions;

export default recentSlice;

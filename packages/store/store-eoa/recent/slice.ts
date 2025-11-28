import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RecentStateType, IRecentItem } from './type';
// import { NetworkType } from '@portkey-wallet/types';

// TODO: BACK TO 100
const MAX_RECENT_COUNT = 5;

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
        recentItem: IRecentItem;
        id: string;
      }>,
    ) => {
      const { id, recentItem } = action.payload;

      const targetList = [...(state.recentMap?.[id] || [])];

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
        [id]: targetList,
      };
    },
    resetTargetIdRecent: (state, action: PayloadAction<string>) => {
      state.recentMap = {
        ...state.recentMap,
        [action.payload]: [],
      };
    },
    resetRecent: () => initialState,
  },
});

export const { addRecentItem, resetRecent, resetTargetIdRecent } = recentSlice.actions;

export default recentSlice;

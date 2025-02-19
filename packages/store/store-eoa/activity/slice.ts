import { createSlice } from '@reduxjs/toolkit';
import { the2ThFailedActivityItemType } from '@portkey-wallet/types/types-eoa/activity';
import { getActivityListAsync } from './action';
import { ActivityStateType } from './type';
import { getCurrentActivityMapKey } from '@portkey-wallet/utils/activity';

const initialState: ActivityStateType = {
  activityMap: {},
  isFetchingActivities: false,
  failedActivityMap: {},
  isLoading: false,
};

//it automatically uses the immer library to let you write simpler immutable updates with normal mutative code
export const activitySlice = createSlice({
  name: 'activity',
  initialState: initialState,
  reducers: {
    addFailedActivity: (state, { payload }: { payload: the2ThFailedActivityItemType }) => {
      state.failedActivityMap[payload?.transactionId] = payload;
    },
    removeFailedActivity: (state, { payload }: { payload: string }) => {
      delete state.failedActivityMap[payload];
    },
    resetActivity: () => initialState,
  },
  extraReducers: builder => {
    builder.addCase(getActivityListAsync.fulfilled, (state, action) => {
      const {
        data,
        totalRecordCount,
        skipCount,
        maxResultCount,
        chainId,
        symbol,
        hasNextPage,
        identify = '',
      } = action.payload;
      const currentMapKey = getCurrentActivityMapKey(chainId, symbol);

      if (!state.activityMap) state.activityMap = {};
      const identifyActivityMap = state.activityMap?.[identify];
      if (!identifyActivityMap) {
        state.activityMap = {
          ...state.activityMap,
          [identify]: {
            [currentMapKey]: {
              data: skipCount === 0 ? data : [...data],
              totalRecordCount,
              skipCount,
              maxResultCount,
              chainId,
              symbol,
              hasNextPage,
            },
          },
        };
      } else {
        identifyActivityMap[currentMapKey] = {
          data: skipCount === 0 ? data : [...(identifyActivityMap[currentMapKey] ?? { data: [] }).data, ...data],
          totalRecordCount,
          skipCount,
          maxResultCount,
          chainId,
          symbol,
          hasNextPage,
        };
      }
      // console.log('fetching=====state key', currentMapKey, 'state content======', JSON.stringify({
      //   data: skipCount === 0 ? data : [...(state.activityMap[currentMapKey] ?? { data: [] }).data, ...data],
      //   totalRecordCount,
      //   skipCount,
      //   maxResultCount,
      //   chainId,
      //   symbol,
      //   hasNextPage,
      // }))
      state.isLoading = false;
    });
    builder.addCase(getActivityListAsync.pending, state => {
      state.isLoading = true;
    });
    builder.addCase(getActivityListAsync.rejected, state => {
      state.isLoading = false;
    });
  },
});

export const { addFailedActivity, removeFailedActivity, resetActivity } = activitySlice.actions;

export default activitySlice;

import { createAsyncThunk } from '@reduxjs/toolkit';
import { fetchActivities } from './api';
import { ActivityStateMapAttributes, IActivitiesApiParams } from './type';

export const getActivityListAsync = createAsyncThunk(
  'activity/getActivityList',
  async (params: IActivitiesApiParams): Promise<ActivityStateMapAttributes> => {
    const response = await fetchActivities(params).catch(error => {
      if (error?.type) throw Error(error.type);
      if (error?.error?.message) throw Error(error.error.message);
      throw Error(JSON.stringify(error));
    });
    if (!response?.data || !response?.totalRecordCount) throw Error('No data');

    return {
      data: response.data,
      totalRecordCount: response.totalRecordCount,
      maxResultCount: params.maxResultCount,
      skipCount: params.skipCount,
      chainId: params.chainId,
      symbol: params.symbol,
    };
  },
);

import { request } from '@portkey-wallet/api/api-did';
import { NFT_MIDDLE_SIZE } from '@portkey-wallet/constants/constants-ca/assets';
import { ActivityItemType } from '@portkey-wallet/types/types-ca/activity';
import { IActivityApiParams, IActivitiesApiParams, IActivitiesApiResponse } from './type';

export function fetchActivities(params: IActivitiesApiParams): Promise<IActivitiesApiResponse> {
  return request.activity.activityList({
    params: {
      ...params,
      width: NFT_MIDDLE_SIZE,
      height: -1,
    },
  });
}

export function fetchActivity(params: IActivityApiParams): Promise<ActivityItemType> {
  return request.activity.activity({
    params: {
      ...params,
      width: NFT_MIDDLE_SIZE,
      height: -1,
    },
  });
}

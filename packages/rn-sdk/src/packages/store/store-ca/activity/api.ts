import { request } from 'packages/api/api-did';
import { NFT_MIDDLE_SIZE } from 'packages/constants/constants-ca/assets';
import { ActivityItemType } from 'packages/types/types-ca/activity';
import {
  IActivityApiParams,
  IActivitiesApiParams,
  IActivitiesApiResponse,
  IActivityListWithAddressApiParams,
} from './type';

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

export function fetchRecentContactActivities(
  params: IActivityListWithAddressApiParams,
): Promise<IActivitiesApiResponse> {
  return request.activity.activityListWithAddress({
    params: {
      ...params,
      width: NFT_MIDDLE_SIZE,
      height: -1,
    },
  });
}

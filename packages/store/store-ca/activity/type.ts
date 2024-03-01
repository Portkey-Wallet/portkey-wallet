import { ActivityItemType, the2ThFailedActivityItemType } from '@portkey-wallet/types/types-ca/activity';
import { TransactionTypes } from '@portkey-wallet/constants/constants-ca/activity';
import { ICaAddressInfoListItemType } from '@portkey-wallet/hooks/hooks-ca/wallet';
import { ChainId } from '@portkey-wallet/types';

export type ActivityStateType = {
  activityMap: ActivityStateMap;
  isFetchingActivities: boolean;
  failedActivityMap: { [transactionId: string]: the2ThFailedActivityItemType };
  isLoading?: boolean;
};

export type ActivityStateMap = {
  [key: string]: ActivityStateMapAttributes;
};

export type ActivityStateMapAttributes = {
  maxResultCount: number;
  skipCount: number;
  data: ActivityItemType[];
  totalRecordCount: number;
  chainId?: string;
  symbol?: string;
};

export interface IActivitiesApiParams {
  maxResultCount: number;
  skipCount: number;
  caAddresses?: string[];
  caAddressInfos?: { chainId: ChainId; chainName: string; caAddress: string }[];
  managerAddresses?: string[];
  transactionTypes?: TransactionTypes[];
  chainId?: string;
  symbol?: string;
  width?: number;
  height?: number;
}

export interface IActivitiesApiResponse {
  data: ActivityItemType[];
  totalRecordCount: number;
}

export enum ActivityTypeEnum {
  TRANSFER_CARD = 'transfer-card',
}

export interface IActivityApiParams {
  transactionId: string;
  blockHash: string;
  caAddresses?: string[];
  activityType?: ActivityTypeEnum;
}

export interface IActivityListWithAddressApiParams {
  maxResultCount: number;
  skipCount: number;
  caAddressInfos: ICaAddressInfoListItemType[];
  targetAddressInfos: ICaAddressInfoListItemType[];
}

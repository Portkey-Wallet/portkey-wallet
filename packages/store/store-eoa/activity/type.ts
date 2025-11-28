import { ActivityItemType, the2ThFailedActivityItemType } from '@portkey-wallet/types/types-eoa/activity';
import { TransactionTypes } from '@portkey-wallet/constants/constants-eoa/activity';
import { ChainId } from '@portkey-wallet/types';

export type ActivityStateType = {
  activityMap: ActivityTotalState;
  isFetchingActivities: boolean;
  failedActivityMap: { [transactionId: string]: the2ThFailedActivityItemType };
  isLoading?: boolean;
};
export type ActivityTotalState = {
  [key: string]: ActivityStateMap;
};
export type ActivityStateMap = {
  [key: string]: ActivityStateMapAttributes | undefined;
};

export type ActivityStateMapAttributes = {
  maxResultCount: number;
  skipCount: number;
  data: ActivityItemType[];
  totalRecordCount: number;
  chainId?: string;
  symbol?: string;
  hasNextPage?: boolean;
  identify?: string;
};

export interface IActivitiesApiParams {
  maxResultCount: number;
  skipCount: number;
  addressInfos?: { chainId: ChainId; chainName: string; address: string }[];
  managerAddresses?: string[];
  transactionTypes?: TransactionTypes[];
  chainId?: string;
  symbol?: string;
  width?: number;
  height?: number;
  identify: string;
}

export interface IActivitiesApiResponse {
  data: ActivityItemType[];
  totalRecordCount: number;
  hasNextPage?: boolean;
}

export enum ActivityTypeEnum {
  TRANSFER_CARD = 'transfer-card',
}

export interface IActivityApiParams {
  transactionId: string;
  blockHash: string;
  addressInfos?: IAddressInfoListItemType[];
  activityType?: ActivityTypeEnum;
  chainId?: ChainId;
}

export interface IActivityListWithAddressApiParams {
  maxResultCount: number;
  skipCount: number;
  addressInfos: IAddressInfoListItemType[];
  targetAddressInfos: IAddressInfoListItemType[];
}

export interface IAddressInfoListItemType {
  chainId: ChainId;
  chainName: string;
  address: string;
  displayChainName?: string;
  chainImageUrl?: string;
}

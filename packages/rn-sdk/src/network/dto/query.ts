import { AddressItem, BaseListResponse } from '@portkey/services';
import { TransactionTypes } from '@portkey-wallet/constants/constants-ca/activity';
import { ITokenInfoType, INftInfoType } from '@portkey-wallet/store/store-ca/assets/type';
import { ChainId } from '@portkey-wallet/types';
import { NftInfo, TransactionFees } from '@portkey-wallet/types/types-ca/activity';
import { CaHolderInfo } from '@portkey-wallet/types/types-ca/wallet';
import { IImInfo } from '@portkey-wallet/types/types-ca/contact';

export interface SearchTokenListParams {
  keyword?: string; // used to filter token list, can be empty
  chainIdArray?: string[]; // if not provided, it's ['AELF', 'tDVV','tDVW']
}

export interface FetchBalanceConfig {
  skipCount?: number;
  maxResultCount?: number;
  caAddressInfos: Array<CaAddressInfoType>;
}

export type FetchBalanceResult = {
  data: ITokenItemResponse[];
  totalRecordCount: number;
};

export type ITokenItemResponse = {
  decimals: number;
  symbol: string;
  tokenContractAddress: string;
  balance: string;
  chainId: string;
  balanceInUsd: string;
  imageUrl: string;
  price: number;
};

export type CaAddressInfoType = { chainId: string; caAddress: string };

export type GetUserTokenListResult = {
  items: IUserTokenItem[];
  totalRecordCount: number;
};

export type IUserTokenItem = {
  isDisplay: boolean;
  isDefault: boolean;
  sortWeight: number;
  token: {
    chainId: ChainId;
    decimals: number;
    address: string;
    symbol: string;
    id: string;
  };
  id: string;
  userId: string;
};

export type FetchTokenPriceResult = {
  items: Array<{ symbol: string; priceInUsd: number }>;
};
export type FetchAccountNftCollectionListParams = {
  skipCount?: number;
  maxResultCount: number;
  caAddressInfos: CaAddressInfosType;
};

export type FetchAccountNftCollectionItemListParams = {
  symbol: string;
  caAddressInfos: CaAddressInfosType;
  skipCount?: number;
  maxResultCount: number;
};

export type FetchAccountNftCollectionItemListResult = {
  data: INftCollectionItem[];
  totalRecordCount: number;
};

export type CaAddressInfosType = { chainId: string; caAddress: string }[];

export type FetchAccountNftCollectionListResult = {
  data: INftCollection[];
  totalRecordCount: number;
};

export type INftCollection = {
  chainId: ChainId;
  collectionName: string;
  imageUrl: string;
  itemCount: number;
  symbol: string;
};

export type INftCollectionItem = {
  alias: string;
  balance: string;
  chainId: string;
  imageLargeUrl: string;
  imageUrl: string;
  symbol: string;
  tokenContractAddress: string;
  tokenId: string;
  totalSupply: string;
};

export type GetAccountAssetsByKeywordsParams = {
  maxResultCount?: number;
  skipCount?: number;
  keyword?: string;
  caAddressInfos: CaAddressInfosType;
  width?: number;
  height?: number;
};

export type GetAccountAssetsByKeywordsResult = {
  data: IAssetItemType[];
  totalRecordCount: number;
};

export interface IAssetItemType {
  chainId: string;
  symbol: string;
  address: string;
  tokenInfo?: ITokenInfoType;
  nftInfo?: INftInfoType;
  tokenContractAddress: string;
}

export type GetRecentTransactionParams = {
  caAddressInfos: CaAddressInfosType;
  skipCount?: number;
  maxResultCount?: number;
};

export type RecentTransactionResponse = BaseListResponse<RecentContactItemType>;

export interface GetContractAddressesParams {
  keyword?: string;
  page?: number;
  size?: number;
  modificationTime?: number; // default is Date.now()
}

export type GetContractListApiType = {
  totalCount: number;
  items: Array<ContactItemType>;
};

export interface ContactItemType {
  id: string;
  index: string;
  name: string;
  avatar?: string;
  addresses: AddressItem[];
  modificationTime: number;
  isDeleted: boolean;
  userId: string;
  caHolderInfo?: Partial<CaHolderInfo>;
  imInfo?: Partial<IImInfo>;
  isImputation?: boolean;
}

export interface IActivitiesApiParams {
  caAddressInfos: { chainId: string; caAddress: string }[];
  managerAddresses: string[];
  chainId: string;
  transactionTypes?: TransactionTypes[]; // if not provided, it's all types
  maxResultCount?: number;
  skipCount?: number;
  symbol?: string; // if you want to filter by symbol, provide it
  width?: number;
  height?: number;
}

export interface IActivitiesApiResponse {
  data: ActivityItemType[];
  totalRecordCount: number;
}

export interface IActivityApiParams {
  transactionId: string;
  blockHash: string;
  caAddressInfos: Array<CaAddressInfoType>;
}

export type ActivityItemType = {
  chainId: string;
  transactionType: TransactionTypes;
  transactionName?: string; // item title
  from: string; // wallet name
  to: string; // to user nick name
  fromAddress: string;
  toAddress: string;
  fromChainId: ChainId;
  toChainId: ChainId;
  status: string;
  transactionId: string;
  blockHash: string; // The chain may have forks, use transactionId and blockHash to uniquely determine the transaction
  timestamp: string;
  isReceived: boolean; // Is it a received transaction
  amount: string;
  symbol: string;
  decimals?: string;
  priceInUsd?: string;
  nftInfo?: NftInfo;
  transactionFees: TransactionFees[];
  listIcon?: string;
  isDelegated?: boolean;
};

export interface RecentContactItemType extends ContactItemType {
  chainId: ChainId;
  chainName: string;
  caAddress: string;
  address: string;
  addressChainId: ChainId;
  transactionTime: string;
  name: string;
  addresses: RecentAddressItem[];
}

export interface RecentAddressItem extends AddressItem {
  transactionTime?: string;
}

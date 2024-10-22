import { ChainId, NetworkType } from '@portkey-wallet/types';
import { NFTCollectionItemShowType, SeedTypeEnum } from '@portkey-wallet/types/types-ca/assets';
import { IAccountCryptoBoxAssetItem, ITokenSectionResponse } from '@portkey-wallet/types/types-ca/token';

export interface ITokenInfoType {
  balance: string;
  decimals: number;
  balanceInUsd: string;
  tokenContractAddress: string;
  imageUrl?: string;
}

export interface INftInfoType {
  imageUrl: string;
  alias: string;
  tokenId: string;
  tokenName?: string;
  collectionName?: string;
  balance: string;
  chainId: string;
  decimals: number;
  seedType?: SeedTypeEnum;
  isSeed?: boolean;
  tokenContractAddress?: string;
  displayChainName?: string;
  chainImageUrl?: string;
}

export interface IAssetItemType {
  chainId: ChainId;
  symbol: string;
  address: string;
  tokenInfo?: ITokenInfoType;
  nftInfo?: INftInfoType;
  label?: string;
}

export interface IAssetToken {
  address: string; // user chain address
  balance: string;
  balanceInUsd: string;
  chainId: ChainId;
  chainImageUrl: string;
  decimals: string;
  displayChainName: string;
  imageUrl: string;
  symbol: string;
  tokenContractAddress: string;
  label?: string;
}

export interface IAssetNftCollection {
  collectionName: string;
  imageUrl: string;
  items: INftInfoType[];
}

export interface IAssetItemV2 {
  nftInfos: IAssetNftCollection[];
  tokenInfos: IAssetToken[];
}

export enum AddressCheckError {
  invalidAddress = 'Invalid Address',
  recipientAddressIsInvalid = 'Recipient address is invalid',
  equalIsValid = 'The sender and recipient address are identical',
}

export type TAccountTokenInfo = {
  skipCount: number;
  maxResultCount: number;
  accountTokenList: ITokenSectionResponse[];
  totalRecordCount: number;
  totalDisplayCount: number;
};

export type TAccountNFTInfo = {
  skipCount: number;
  maxResultCount: number;
  accountNFTList: NFTCollectionItemShowType[];
  totalRecordCount: number;
};

export type TAccountAssetsInfo = {
  skipCount: number;
  maxResultCount: number;
  accountAssetsList: IAssetItemType[];
  totalRecordCount: number;
};

export type TAccountAssetsInfoV2 = {
  skipCount: number;
  maxResultCount: number;
  accountAssetsList: IAssetItemV2;
  totalRecordCount: number;
};

// asset = token + nft
export type TAssetsState = {
  accountToken: TAccountTokenInfo & {
    isFetching: boolean;
    accountTokenInfoV2?: {
      [key in NetworkType]?: TAccountTokenInfo;
    };
  };
  accountNFT: TAccountNFTInfo & {
    isFetching: boolean;
    accountNFTInfo?: {
      [key in NetworkType]?: TAccountNFTInfo;
    };
  };
  tokenPrices: {
    isFetching: boolean;
    tokenPriceObject: {
      [symbol: string]: number | string;
    };
  };
  accountAssets: TAccountAssetsInfo & {
    isFetching: boolean;
    accountAssetsInfo?: {
      [key in NetworkType]?: TAccountAssetsInfo;
    };
  };
  accountAssetsV2: TAccountAssetsInfoV2 & {
    isFetching: boolean;
    accountAssetsInfo?: {
      [key in NetworkType]?: TAccountAssetsInfoV2;
    };
  };
  accountBalance: {
    accountBalanceInfo?: {
      [key in NetworkType]?: string;
    };
  };
  accountCryptoBoxAssets: {
    isFetching: boolean;
    skipCount: number;
    maxResultCount: number;
    accountAssetsList: IAccountCryptoBoxAssetItem[];
    totalRecordCount: number;
  };
};

import { ChainId, NetworkType } from '@portkey-wallet/types';
import { NFTCollectionItemShowType, SeedTypeEnum } from '@portkey-wallet/types/types-ca/assets';
import { IAccountCryptoBoxAssetItem, TokenItemShowType } from '@portkey-wallet/types/types-ca/token';

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
}

export interface IAssetItemType {
  chainId: ChainId;
  symbol: string;
  address: string;
  tokenInfo?: ITokenInfoType;
  nftInfo?: INftInfoType;
}

export enum AddressCheckError {
  invalidAddress = 'Invalid Address',
  recipientAddressIsInvalid = 'Recipient address is invalid',
  equalIsValid = 'The sender and recipient address are identical',
}

export type AccountTokenInfoType = {
  skipCount: number;
  maxResultCount: number;
  accountTokenList: TokenItemShowType[];
  totalRecordCount: number;
};

export type AccountNFTInfoType = {
  skipCount: number;
  maxResultCount: number;
  accountNFTList: NFTCollectionItemShowType[];
  totalRecordCount: number;
};

export type AccountAssetsInfoType = {
  skipCount: number;
  maxResultCount: number;
  accountAssetsList: IAssetItemType[];
  totalRecordCount: number;
};

// asset = token + nft
export type AssetsStateType = {
  accountToken: AccountTokenInfoType & {
    isFetching: boolean;
    accountTokenInfo?: {
      [key in NetworkType]?: AccountTokenInfoType;
    };
  };
  accountNFT: AccountNFTInfoType & {
    isFetching: boolean;
    accountNFTInfo?: {
      [key in NetworkType]?: AccountNFTInfoType;
    };
  };
  tokenPrices: {
    isFetching: boolean;
    tokenPriceObject: {
      [symbol: string]: number | string;
    };
  };
  accountAssets: AccountAssetsInfoType & {
    isFetching: boolean;
    accountAssetsInfo?: {
      [key in NetworkType]?: AccountAssetsInfoType;
    };
  };
  accountCryptoBoxAssets: {
    isFetching: boolean;
    skipCount: number;
    maxResultCount: number;
    accountAssetsList: IAccountCryptoBoxAssetItem[];
    totalRecordCount: number;
  };
  accountBalance: number | string;
};

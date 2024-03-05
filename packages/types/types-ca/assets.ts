import { ChainId } from '..';

export enum SeedTypeEnum {
  'None' = 0,
  'FT' = 1,
  'NFT' = 2,
}

// nft collection types
export type NFTCollectionItemBaseType = {
  chainId: ChainId;
  collectionName: string;
  imageUrl: string;
  itemCount: number;
  symbol: string;
  isSeed: boolean;
  seedType?: SeedTypeEnum;
  expires?: string;
};

export interface NFTCollectionItemShowType extends NFTCollectionItemBaseType {
  isFetching: boolean;
  skipCount: number;
  maxResultCount: number;
  totalRecordCount: string | number;
  children: NFTItemBaseType[];
}

// nft item types
export type NFTItemBaseType = {
  chainId: ChainId;
  symbol: string;
  tokenId: string;
  alias: string;
  quantity: string;
  imageUrl: string;
  tokenContractAddress: string;
  totalSupply: string | number;
  decimals: string;
  isSeed: boolean;
  seedType?: SeedTypeEnum;
};

// assets types
export type AssetsItemType = {
  chainId: ChainId;
  symbol: string;
  address: string;
  nftInfo: {
    imageUrl: string;
    alias: string;
    tokenId: string;
    protocolName: string;
    quantity: string;
    metaData: any;
    decimals: string;
    isSeed: boolean;
    seedType?: SeedTypeEnum;
  };
};

export type RateBaseType = {
  symbol: string;
  priceInUsd: string | number;
};

import { ChainId } from '..';

export enum FreeMintStatus {
  PENDING = 'PENDING',
  NONE = 'NONE',
  SUCCESS = 'SUCCESS',
  FAIL = 'FAIL',
}
export interface IStatus {
  status: FreeMintStatus;
}
export interface IFreeMintRecentStatus extends IStatus {
  itemId: string;
}

export interface ICollectionData {
  collectionInfo: ICollectionInfo;
  transactionFee: number;
  limitCount: number;
  isLimitExceed: boolean;
}
export interface ICollectionInfo {
  imageUrl: string;
  collectionName: string;
  chainId: ChainId;
  symbol: string;
}

export interface IItemRequest {
  imageUrl: string;
  name: string;
  tokenId: string;
  description: string;
}
export interface IItem {
  itemId: string;
}

export interface IConfirmMintRes {
  itemId: string;
  tokenId: string;
  name: string;
  symbol: string;
}

export interface ITokenDetails {
  symbol: string;
  chainId: string;
  tokenId: string;
  alias: string;
  balance: string;
  totalSupply: number;
  circulatingSupply: number;
  imageUrl: string;
  tokenContractAddress: string;
  imageLargeUrl: string;
  decimals: string;
  collectionSymbol: string;
  tokenName: string;
  status: FreeMintStatus;
}

export interface IMintNFTItemInfo {
  description: string;
  imageUrl: string;
  name: string;
  status: FreeMintStatus;
  tokenId: string;
  symbol: string;
}

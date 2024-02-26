import { AssetType } from '@portkey-wallet/constants/constants-ca/assets';
import { ChainId } from '@portkey-wallet/types';

export interface ITokenInfoType {
  balance: string;
  decimals: number;
  balanceInUsd: string;
  tokenContractAddress: string;
}

export interface INftInfoType {
  imageUrl: string;
  alias: string;
  tokenId: string;
  collectionName: string;
  balance: string;
  chainId: string;
}

export interface IAssetItemType {
  chainId: ChainId;
  symbol: string;
  address: string;
  tokenInfo?: ITokenInfoType;
  nftInfo?: INftInfoType;
}

export interface ICryptoBoxAssetItemType {
  chainId: ChainId;
  address: string;
  symbol: string;
  imageUrl: string;
  decimals: number;
  alias?: string;
  tokenId?: string;
  assetType?: AssetType;
}

export enum AddressCheckError {
  invalidAddress = 'Invalid Address',
  recipientAddressIsInvalid = 'Recipient address is invalid',
  equalIsValid = 'The sender and recipient address are identical',
}

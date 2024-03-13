import { ChainId } from '@portkey-wallet/types';
import { SeedTypeEnum } from '@portkey-wallet/types/types-ca/assets';

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

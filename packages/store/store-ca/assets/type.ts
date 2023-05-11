export interface ITokenInfoType {
  balance: string;
  decimals: string;
  balanceInUsd: string;
  chainId: string;
}

export interface INftInfoType {
  imageUrl: string;
  alias: string;
  tokenId: string;
  collectionName: string;
  quantity: string;
  chainId: string;
  balance: string;
}

export interface IAssetItemType {
  id: string;
  chainId: string;
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

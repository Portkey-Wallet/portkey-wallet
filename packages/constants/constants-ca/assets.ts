import { ITokenSectionResponse } from '@portkey-wallet/types/types-ca/token';

export enum TransactionError {
  TOKEN_NOT_ENOUGH = 'Insufficient funds',
  NFT_NOT_ENOUGH = 'Insufficient quantity',
  FEE_NOT_ENOUGH = 'Insufficient funds for transaction fee',
  CROSS_NOT_ENOUGH = 'Insufficient funds for cross-chain transaction fee',
}

export const REFRESH_TIME = 5 * 60 * 1000; // 5min refresh

export const NEW_CLIENT_MOCK_ELF_LIST: ITokenSectionResponse[] = [
  {
    balance: '2300000000',
    balanceInUsd: '110000000',
    price: 0.3713, // todo_wade: confirm
    decimals: 8,
    imageUrl: 'https://portkey-did.s3.ap-northeast-1.amazonaws.com/img/aelf_token_logo.png',
    symbol: 'ELF',
    tokens: [
      {
        balance: '0',
        balanceInUsd: '3.000000',
        chainId: 'AELF',
        decimals: 8,
        imageUrl: 'https://portkey-did.s3.ap-northeast-1.amazonaws.com/img/aelf_token_logo.png',
        symbol: 'ELF',
        tokenContractAddress: 'JRmBduh4nXWi1aXgdUsj5gJrzeZb2LxmrAbf7W99faZSvoAaE',
      },
      {
        balance: '0',
        balanceInUsd: '8.000000',
        chainId: 'tDVV',
        decimals: 8,
        imageUrl: 'https://portkey-did.s3.ap-northeast-1.amazonaws.com/img/aelf_token_logo.png',
        symbol: 'ELF',
        tokenContractAddress: 'JRmBduh4nXWi1aXgdUsj5gJrzeZb2LxmrAbf7W99faZSvoAaE',
      },
    ],
  },
  {
    balance: '1000000000',
    balanceInUsd: '340000000',
    price: 1,
    decimals: 8,
    imageUrl: 'https://portkey-did.s3.ap-northeast-1.amazonaws.com/img/aelf/Coin-USDT.png',
    symbol: 'USDT',
    tokens: [
      {
        balance: '2',
        balanceInUsd: '2.000000',
        chainId: 'AELF',
        decimals: 8,
        imageUrl: 'https://portkey-did.s3.ap-northeast-1.amazonaws.com/img/aelf/Coin-USDT.png',
        symbol: 'ELF',
        tokenContractAddress: 'JRmBduh4nXWi1aXgdUsj5gJrzeZb2LxmrAbf7W99faZSvoAaE',
      },
      {
        balance: '8',
        balanceInUsd: '8.000000',
        chainId: 'tDVV',
        decimals: 8,
        imageUrl: 'https://portkey-did.s3.ap-northeast-1.amazonaws.com/img/aelf/Coin-USDT.png',
        symbol: 'ELF',
        tokenContractAddress: 'JRmBduh4nXWi1aXgdUsj5gJrzeZb2LxmrAbf7W99faZSvoAaE',
      },
    ],
  },
];

export const PAGE_SIZE_IN_NFT_ITEM = 9;

export const PAGE_SIZE_IN_ACCOUNT_NFT_COLLECTION = 20;

export const PAGE_SIZE_IN_ACCOUNT_TOKEN = 20;

export const PAGE_SIZE_IN_ACCOUNT_ASSETS = 20;

export const PAGE_SIZE_DEFAULT = 50;

export const ELF_SYMBOL = 'ELF';

export const NFT_SMALL_SIZE = 144;
export const NFT_MIDDLE_SIZE = 294;
export const NFT_LARGE_SIZE = 1008;

export enum BalanceTab {
  TOKEN = 'token',
  NFT = 'nft',
  ACTIVITY = 'activity',
}

export enum ContactsTab {
  ALL = 'All',
  Chats = 'Chats',
}

export enum AssetType {
  ft = 1,
  nft = 2,
}

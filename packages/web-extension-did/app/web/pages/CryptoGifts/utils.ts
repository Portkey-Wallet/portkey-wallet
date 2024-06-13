import { fetchTokenPrices } from '@portkey-wallet/store/store-ca/assets/api';
import { ICryptoBoxAssetItemType } from '@portkey-wallet/types/types-ca/crypto';

export const DEFAULT_GIFT_TOKEN: ICryptoBoxAssetItemType = {
  chainId: 'AELF',
  symbol: 'ELF',
  decimals: '8',
  imageUrl: 'https://portkey-did.s3.ap-northeast-1.amazonaws.com/img/aelf/Coin-ELF.png',
  assetType: 1,
  address: 'JRmBduh4nXWi1aXgdUsj5gJrzeZb2LxmrAbf7W99faZSvoAaE',
  isSeed: false,
  seedType: 0,
};

export const TDVW_CHAIN_GIFT_TOKEN: ICryptoBoxAssetItemType = {
  chainId: 'tDVW',
  symbol: 'ELF',
  decimals: '8',
  imageUrl: 'https://portkey-did.s3.ap-northeast-1.amazonaws.com/img/aelf/Coin-ELF.png',
  assetType: 1,
  address: 'ASh2Wt7nSEmYqnGxPPzp4pnVDU4uhj1XW9Se5VeZcX2UDdyjx',
  isSeed: false,
  seedType: 0,
};

export const TDVV_CHAIN_GIFT_TOKEN: ICryptoBoxAssetItemType = {
  chainId: 'tDVW',
  symbol: 'ELF',
  decimals: '8',
  imageUrl: 'https://portkey-did.s3.ap-northeast-1.amazonaws.com/img/aelf/Coin-ELF.png',
  assetType: 1,
  address: '7RzVGiuVWkvL4VfVHdZfQF2Tri3sgLe9U991bohHFfSRZXuGX',
  isSeed: false,
  seedType: 0,
};

export const getPrice = async (symbol: string) => {
  try {
    const res = await fetchTokenPrices({ symbols: [symbol] });
    const target = (res.items ?? []).find((item) => item.symbol === symbol);
    return target?.priceInUsd ?? 0;
  } catch (error) {
    console.log('===fetchTokenPrices error', error);
    return 0;
  }
};

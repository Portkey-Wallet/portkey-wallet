export default {
  fetchAccountTokenList: '/api/app/user/assets/token',
  fetchAccountNftCollectionList: '/api/app/user/assets/nftCollections',
  fetchAccountNftCollectionItemList: '/api/app/user/assets/nftItems',
  fetchAccountNftCollectionItem: '/api/app/user/assets/nftItem',
  // nft and tokens
  fetchAccountAssetsByKeywords: '/api/app/user/assets/searchUserAssets',
  // nft and token in crypto box
  fetchCryptoBoxAccountAssetsByKeywords: '/api/app/user/assets/searchUserPackageAssets',
  fetchTokenPrice: {
    target: '/api/app/tokens/prices',
    config: { method: 'GET' },
  },
  getSymbolImages: {
    target: '/api/app/user/assets/symbolImages',
    config: { method: 'GET' },
  },
} as const;

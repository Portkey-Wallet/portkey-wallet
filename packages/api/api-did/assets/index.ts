export default {
  fetchAccountTokenList: '/api/app/user/assets/token',
  fetchAccountTokenListV2: '/api/app/v2/user/assets/token',
  fetchAccountNftCollectionList: '/api/app/user/assets/nftCollections',
  fetchAccountNftCollectionItemList: '/api/app/user/assets/nftItems',
  fetchAccountNftCollectionItem: {
    target: '/api/app/user/assets/nftItem',
    config: {
      method: 'POST',
      timeout: 20 * 1000,
    },
  },
  // nft and tokens
  fetchAccountAssetsByKeywords: '/api/app/user/assets/searchUserAssets',
  fetchAccountAssetsByKeywordsV2: '/api/app/v2/user/assets/searchUserAssets',
  // nft and token in crypto box
  fetchCryptoBoxAccountAssetsByKeywords: '/api/app/user/assets/searchUserPackageAssets',
  fetchTokenPrice: {
    target: '/api/app/tokens/prices',
    config: { method: 'GET' },
  },
  fetchTokenAllowanceList: '/api/app/tokens/allowances',
  getSymbolImages: {
    target: '/api/app/user/assets/symbolImages',
    config: { method: 'GET' },
  },
  getTokenBalance: {
    target: '/api/app/user/assets/tokenBalance',
    config: { method: 'GET' },
  },
  getAssetsEstimation: {
    target: '/api/app/user/assets/asset-estimation',
    config: { method: 'GET' },
  },
} as const;

export default {
  fetchTokenPrice: {
    target: '/api/app/tokens/prices',
    config: { method: 'GET' },
  },
  fetchPopularToken: {
    target: '/api/app/userTokens',
    config: { method: 'GET' },
  },
  displayUserToken: {
    target: '/api/app/userTokens',
    config: { method: 'PUT' },
  },
  displayUserTokenV2: {
    target: '/api/app/v2/userTokens',
    config: { method: 'PUT' },
  },
  fetchTokenListBySearch: {
    target: '/api/app/tokens/list',
    config: { method: 'GET' },
  },
  fetchTokenListBySearchV2: {
    target: '/api/app/v2/tokens/list',
    config: { method: 'GET' },
  },
  fetchTokenItemBySearch: {
    target: 'api/app/tokens/token',
    config: { method: 'GET' },
  },
  closeZeroHoldingsToken: {
    target: '/api/app/assets/zeroHoldings/close',
    config: { method: 'POST' },
  },
  openZeroHoldingsToken: {
    target: '/api/app/assets/zeroHoldings/open',
    config: { method: 'POST' },
  },
  zeroHoldingsTokenStatus: {
    target: '/api/app/assets/zeroHoldings/status',
    config: { method: 'GET' },
  },
} as const;

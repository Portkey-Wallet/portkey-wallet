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
  fetchTokenListBySearch: {
    target: '/api/app/tokens/list',
    config: { method: 'GET' },
  },
  fetchTokenItemBySearch: {
    target: 'api/app/tokens/token',
    config: { method: 'GET' },
  },
} as const;

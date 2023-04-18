export default {
  fetchTokenPrice: {
    target: '/api/app/tokens/prices',
    config: { method: 'GET' },
  },
  displayUserToken: {
    target: '/api/app/userTokens',
    config: { method: 'PUT' },
  },
} as const;

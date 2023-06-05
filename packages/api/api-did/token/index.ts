export default {
  fetchTokenPrice: {
    target: '/api/app/tokens/prices',
    config: { method: 'GET' },
  },
  displayUserToken: {
    target: '/api/app/userTokens',
    config: { method: 'PUT' },
  },
  getClaimToken: '/api/app/claimToken/getClaimToken',
} as const;

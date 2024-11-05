export default {
  getSwapRoutes: {
    target: '/api/app/route/best-swap-routes',
    config: { method: 'GET' },
  },
  getAwakenGasFee: {
    target: '/api/app/transaction-fee',
    config: { method: 'GET' },
  },
} as const;

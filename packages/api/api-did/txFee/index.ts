export default {
  fetchTxFee: {
    target: '/api/app/account/transactionFee',
    config: { method: 'GET' },
  },
} as const;

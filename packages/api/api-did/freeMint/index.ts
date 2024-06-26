export default {
  getRecentStatus: {
    target: '/api/app/mint/recentStatus',
    config: { method: 'GET' },
  },
  getMintInfo: {
    target: '/api/app/mint/Info',
    config: { method: 'GET' },
  },
  confirmMint: '/api/app/mint/confirm',
  confirmAgain: '/api/app/mint/mintAgain',
  getMintStatus: {
    target: '/api/app/mint/status',
    config: { method: 'GET' },
  },
  getMintDetail: {
    target: '/api/app/mint/detail',
    config: { method: 'GET' },
  },
  editHolderInfo: '/api/app/account/holderInfo',
} as const;

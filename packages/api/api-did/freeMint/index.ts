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
  getMintItemInfo: {
    target: '/api/app/mint/itemInfo',
    config: { method: 'GET' },
  },
} as const;

export default {
  getSendNetworkList: {
    target: '/api/app/transfer/getSendNetworkList',
    config: { method: 'GET' },
  },
  getTransferSupportNetworkMap: {
    target: '/api/app/proxy/api/app/transfer/support',
    config: { method: 'GET' },
  },
} as const;

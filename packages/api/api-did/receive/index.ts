export default {
  fetchReceiveNetworkList: {
    target: '/api/app/transfer/getReceiveNetworkList',
    config: { method: 'GET' },
  },
} as const;

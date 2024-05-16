export default {
  getTokenList: {
    target: '/api/app/transfer/token/list',
    config: { method: 'GET' },
  },
  getTokenListByNetwork: {
    target: '/api/app/transfer/network/tokens',
    config: { method: 'GET' },
  },
  getDepositTokenList: {
    target: '/api/app/transfer/token/option',
    config: { method: 'GET' },
  },
  getNetworkList: {
    target: '/api/app/transfer/network/list',
    config: { method: 'GET' },
  },
  getDepositInfo: {
    target: '/api/app/transfer/deposit/info',
    config: { method: 'GET' },
  },
  depositCalculator: {
    target: '/api/app/transfer/deposit/calculator',
    config: { method: 'GET' },
  },
  getTransferToken: {
    target: '/api/app/transfer/connect/token',
    config: { method: 'POST' },
  },
} as const;

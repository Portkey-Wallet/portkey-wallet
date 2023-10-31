export default {
  getRampInfo: {
    target: '/api/app/thirdPart/ramp/info',
    config: { method: 'GET' },
  },
  getCrypto: {
    target: '/api/app/thirdPart/ramp/crypto',
    config: { method: 'GET' },
  },
  getFiat: {
    target: '/api/app/thirdPart/ramp/fiat',
    config: { method: 'GET' },
  },
  getRampLimit: {
    target: '/api/app/thirdPart/ramp/limit',
    config: { method: 'GET' },
  },
  getRampExchange: {
    target: '/api/app/thirdPart/ramp/exchange',
    config: { method: 'GET' },
  },
  getRampPrice: {
    target: '/api/app/thirdPart/ramp/price',
    config: { method: 'GET' },
  },
  getRampDetail: {
    target: '/api/app/thirdPart/ramp/detail',
    config: { method: 'GET' },
  },
  sendSellTransaction: '/api/app/thirdPart/ramp/transaction',
  getOrderNo: '/api/app/thirdPart/order',

  // TODO ramp
  updateAchOrder: '/api/app/thirdPart/order/alchemy',
  updateTransakOrder: '/api/app/thirdPart/order/transak',
  getAchToken: '/api/app/thirdPart/alchemy/token',
  getAchSignature: {
    target: '/api/app/thirdPart/alchemy/signature',
    config: { method: 'GET' },
  },
} as const;

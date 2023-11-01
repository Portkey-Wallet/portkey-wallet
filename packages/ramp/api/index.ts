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
  updateAchOrder: '/api/app/thirdPart/order/alchemy', // alchemy callbackUrl
  updateTransakOrder: '/api/app/thirdPart/order/transak', // transak callbackUrl
  getAchToken: '/api/app/thirdPart/ramp/alchemy/token',
  getAchSignature: {
    target: '/api/app/thirdPart/ramp/alchemy/signature',
    config: { method: 'GET' },
  },
} as const;

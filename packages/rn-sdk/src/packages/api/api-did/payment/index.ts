export default {
  getFiatList: {
    target: '/api/app/thirdPart/alchemy/fiatList',
    config: { method: 'GET' },
  },
  getCryptoList: {
    target: '/api/app/thirdPart/alchemy/cryptoList',
    config: { method: 'GET' },
  },
  getOrderQuote: '/api/app/thirdPart/alchemy/order/quote',
  getAchToken: '/api/app/thirdPart/alchemy/token',
  getOrderNo: '/api/app/thirdPart/order',
  getAchSignature: {
    target: '/api/app/thirdPart/alchemy/signature',
    config: { method: 'GET' },
  },
  updateAchOrder: '/api/app/thirdPart/order/alchemy',
  updateAlchemyOrderTxHash: '/api/app/thirdPart/alchemy/txHash',
  sendSellTransaction: '/api/app/thirdPart/alchemy/transaction',
} as const;

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
  getAchSignature: '/api/app/thirdPart/alchemy/signature',
  updateAchOrder: '/api/app/thirdPart/order/alchemy',
  setOrderTxHash: 'api/app/thirdPart/txHash',
} as const;

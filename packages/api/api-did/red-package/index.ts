export default {
  getFirstCryptoGift: {
    target: '/api/app/cryptogift/history/first',
    config: { method: 'GET' },
  },
  getCryptoGiftHistories: {
    target: '/api/app/cryptogift/histories',
    config: { method: 'GET' },
  },
  getCryptoGiftDetail: {
    target: '/api/app/redpackage/detail',
    config: { method: 'GET' },
  },
  sendCryptoGift: {
    target: '/api/app/redpackage/send',
    config: { method: 'POST' },
  },
  generateCryptoGift: {
    target: '/api/app/redpackage/generate',
    config: { method: 'POST' },
  },
  getCreationStatus: {
    target: '/api/app/redPackage/getCreationResult',
    config: { method: 'GET' },
  },
  getRedPackageConfig: {
    target: '/api/app/redpackage/config',
    config: { method: 'GET' },
  },
} as const;
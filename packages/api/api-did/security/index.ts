export default {
  securityList: {
    target: '/api/app/user/security/transferLimit',
    config: { method: 'GET' },
  },
  balanceCheck: {
    target: '/api/app/user/security/balanceCheck',
    config: { method: 'GET' },
  },
} as const;

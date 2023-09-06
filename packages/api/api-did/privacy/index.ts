export default {
  privacyPolicy: '/api/app/privacypolicy/sign',
  securityCheck: {
    target: '/api/app/user/security/balanceCheck',
    config: { method: 'GET' },
  },
} as const;

export default {
  securityList: {
    target: '/api/app/user/security/transferLimit',
    config: { method: 'GET' },
  },
  balanceCheck: {
    target: '/api/app/user/security/balanceCheck',
    config: { method: 'GET' },
  },
  // secondary email api
  secondaryMail: {
    target: '/api/app/account/secondary/email',
    config: { method: 'GET' },
  },
  sendSecondaryEmailCode: {
    target: '/api/app/account/secondary/email/verify',
    config: { method: 'POST' },
  },
  secondaryEmailCodeCheck: {
    target: '/api/app/account/verifyCode/secondary/email',
    config: { method: 'POST' },
  },
  setSecondaryEmail: {
    target: '/api/app/account/set/secondary/email',
    config: { method: 'POST' },
  },
} as const;

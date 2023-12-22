export default {
  sendVerificationRequest: '/api/app/account/sendVerificationRequest',
  checkVerificationCode: '/api/app/account/verifyCode',
  getCountry: '/api/app/ipInfo/ipInfo',
  verifyGoogleToken: '/api/app/account/verifyGoogleToken',
  verifyAppleToken: '/api/app/account/verifyAppleToken',
  sendAppleUserExtraInfo: '/api/app/userExtraInfo/appleUserExtraInfo',
  getAppleUserExtraInfo: {
    target: `/api/app/userExtraInfo`,
    config: { method: 'GET' },
  },
  checkGoogleRecaptcha: '/api/app/account/isGoogleRecaptchaOpen',
  getVerifierServer: '/api/app/account/getVerifierServer',
} as const;

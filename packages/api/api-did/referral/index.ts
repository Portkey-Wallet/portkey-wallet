export default {
  getReferralRedDotsStatus: {
    target: '/api/app/growth/redDot',
    config: { method: 'GET' },
  },
  setReferralRedDotsStatus: '/api/app/growth/redDot',
  getReferralShortLink: {
    target: '/api/app/growth/shortLink',
    config: { method: 'GET' },
  },
} as const;

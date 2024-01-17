export default {
  getReferralRedDotsStatus: {
    target: '/api/app/growth/red-dots',
    config: { method: 'GET' },
  },
  setReferralRedDotsStatus: '/api/app/growth/red-dot',
  getReferralShortLink: {
    target: '/api/app/growth/short-link',
    config: { method: 'GET' },
  },
} as const;

export default {
  getRedDotsStatus: {
    target: '/api/app/growth/red-dots',
    config: { method: 'GET' },
  },
  setRedDotsStatus: '/api/app/growth/red-dot',
  getShortLink: {
    target: '/api/app/growth/short-link',
    config: { method: 'GET' },
  },
} as const;

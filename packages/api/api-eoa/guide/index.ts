export default {
  getGuideList: {
    target: '/api/app/user/guide/list',
    config: { method: 'GET' },
  },
  getGuideItem: {
    target: '/api/app/user/guide/query',
    config: { method: 'GET' },
  },
  finishGuideItem: '/api/app/user/guide/finish',
} as const;

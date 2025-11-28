export default {
  addBookmark: '/api/app/bookmarks',
  deleteAllBookmark: {
    target: '/api/app/bookmarks',
    config: { method: 'DELETE' },
  },
  deleteBookmark: '/api/app/bookmarks/modify',
  getBookmarks: {
    target: '/api/app/bookmarks',
    config: { method: 'GET' },
  },
  getCryptoCurrencyList: {
    target: '/api/app/cryptocurrency/list',
    config: { method: 'GET' },
  },
  markFavorite: {
    target: '/api/app/cryptocurrency/mark',
  },
  unMarkFavorite: {
    target: '/api/app/cryptocurrency/unmark',
  },
  checkDappInfo: {
    target: '/api/app/contracts/websiteValild',
    config: { method: 'GET' },
  },
  checkSpenderValid: {
    target: '/api/app/contracts/spenderValid',
    config: { method: 'GET' },
  },
} as const;

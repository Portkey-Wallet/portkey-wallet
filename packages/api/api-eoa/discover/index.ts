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
    target: '/api/app/proxy/api/app/cryptocurrency/noAuth/list',
    config: { method: 'GET' },
  },
  markFavorite: {
    target: '/api/app/cryptocurrency/mark',
  },
  unMarkFavorite: {
    target: '/api/app/cryptocurrency/unmark',
  },
} as const;

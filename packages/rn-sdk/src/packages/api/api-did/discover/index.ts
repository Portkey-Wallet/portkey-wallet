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
} as const;

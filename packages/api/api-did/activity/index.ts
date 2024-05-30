export default {
  activityList: '/api/app/user/activities/activities',
  activity: '/api/app/user/activities/activity',
  activityListWithAddress: '/api/app/user/activities/transactions',
  reportTransaction: {
    target: 'api/app/report/transaction',
    config: { method: 'POST' },
  },
} as const;

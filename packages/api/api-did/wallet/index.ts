export default {
  requestRegister: '/api/app/account/register/request',
  recoveryWallet: '/api/app/account/recovery/request',
  guardianIdentifiers: {
    target: '/api/app/account/guardianIdentifiers',
    config: { method: 'GET' },
  },
  getRegisterInfo: {
    target: '/api/app/account/registerInfo',
    config: { method: 'GET' },
  },
  // TODO Test api
  hubPing: '/api/app/account/hub/ping',
  getCreateResponse: 'api/app/account/hub/response',
  queryRecovery: '/api/app/account/recovery/query',
  queryRegister: '/api/app/account/register/query',
  setWalletName: '/api/app/account/setNickname',
  getChainList: '/api/app/getChains',
  editWalletName: {
    target: '/api/app/account/nickname',
    config: { method: 'PUT' },
  },
  editHolderInfo: '/api/app/account/holderInfo',
  pullNotify: 'api/app/notify/pullNotify',
  getPhoneCountryCode: {
    target: '/api/app/phone/info',
    config: { method: 'GET' },
  },
  getShowDeletionEntrance: {
    target: '/api/app/account/revoke/entrance',
    config: { method: 'GET' },
  },
  deletionCheck: {
    target: '/api/app/account/revoke/check',
    config: { method: 'GET' },
  },
  deletionAccount: '/api/app/account/revoke/request',

  getTwitterUserInfo: {
    target: '/api/app/twitterAuth/userInfo',
    config: { method: 'GET' },
  },
} as const;

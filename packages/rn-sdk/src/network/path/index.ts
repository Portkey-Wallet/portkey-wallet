export enum APIPaths {
  // create wallet or verify guardian
  CHECK_GOOGLE_RECAPTCHA = '/api/app/account/isGoogleRecaptchaOpen',
  GET_GUARDIAN_INFO = '/api/app/account/guardianIdentifiers',
  GET_REGISTER_INFO = '/api/app/account/registerInfo',
  SEND_VERIFICATION_CODE = '/api/app/account/sendVerificationRequest',
  CHECK_VERIFICATION_CODE = '/api/app/account/verifyCode',
  REQUEST_REGISTER = '/api/app/account/register/request',
  REQUEST_RECOVERY = '/api/app/account/recovery/request',
  STUB_GET_GUARDIAN_INFO_BY_MANAGER = '#getHolderInfoByManager_stub',
  SEND_APPLE_USER_EXTRA_INFO = '/api/app/userExtraInfo/appleUserExtraInfo',
  VERIFY_GOOGLE_TOKEN = '/api/app/account/verifyGoogleToken',
  VERIFY_APPLE_TOKEN = '/api/app/account/verifyAppleToken',
  GET_PHONE_COUNTRY_CODE = '/api/app/phone/info',
  GET_RECOMMEND_GUARDIAN = '/api/app/account/getVerifierServer',
  CHECK_SOCIAL_RECOVERY_STATUS = '/api/app/search/accountrecoverindex',
  CHECK_REGISTER_STATUS = '/api/app/search/accountregisterindex',
  CHECK_CHAIN_STATUS = '/api/app/search/chainsinfoindex',

  // verify qrcode status
  CHECK_QR_CODE_STATUS = '/api/app/qrcode',
  GET_SYMBOL_IMAGE = '/api/app/user/assets/symbolImages',

  // connect token for portkey backend service
  REFRESH_NETWORK_TOKEN = '/connect/token',

  // assets service
  GET_TOKEN_INFO = '/api/app/search/usertokenindex',
  GET_USER_TOKEN_STATUS = '/api/app/user/assets/token',
  GET_TOKEN_PRICES = '/api/app/tokens/prices',
  FETCH_NFT_COLLECTIONS = '/api/app/user/assets/nftCollections',
  FETCH_NFT_COLLECTIONS_ITEM = '/api/app/user/assets/nftItems',
  SEARCH_USER_ASSETS = '/api/app/user/assets/searchUserAssets',
  CHECK_TRANSACTION_FEE = '/api/app/account/transactionFee',
  GET_USER_TOKEN_CONFIG = '/api/app/userTokens',
  CHECK_AVAILABLE_TOKEN = '/api/app/tokens/token',

  // account info
  GET_RECENT_ADDRESS = '/api/app/user/assets/recentTransactionUsers',
  READ_CONTRACTS_ADDRESS = '/api/app/contacts/list',
  GET_RECENT_ACTIVITIES = '/api/app/user/activities/activities',
  GET_ACTIVITY_INFO = '/api/app/user/activities/activity',

  // security service
  CHECK_TRANSFER_LIMIT = '/api/app/user/security/transferLimit',
  CHECK_TRANSFER_SECURITY = '/api/app/user/security/balanceCheck',

  // Token/NFT activities
  GET_ACTIVITY_LIST_WITH_ADDRESS = '/api/app/user/activities/transactions',
}

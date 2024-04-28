import { PortkeyEntries } from './types';
export type AppRouteName =
  | 'LoginPortkey'
  | 'SignupPortkey'
  | 'ScanLogin'
  | 'SetPin'
  | 'ConfirmPin'
  | 'SetBiometrics'
  | 'CheckPin'
  | 'AssetsHome'
  | 'GuardianApproval'
  | 'VerifierDetails'
  | 'GuardianEdit'
  | 'GuardianDetail'
  | 'SecurityLock'
  | 'GuardianHome'
  | 'Receive'
  | 'ActivityListPage'
  | 'ActivityDetail'
  | 'ViewOnWebView'
  | 'SendHome'
  | 'SendPreview'
  | 'ManageTokenList'
  | 'TokenDetail'
  | 'CustomToken'
  | 'NFTDetail'
  | 'RampHome'
  | 'RampPreview'
  | 'PaymentSecurityList'
  | 'PaymentSecurityDetail'
  | 'PaymentSecurityEdit'
  | 'ContactActivity'
  | 'QrScanner'
  | 'QrCodeResult'
  | 'Tab';

const RouteNameMapping: Record<AppRouteName, PortkeyEntries> = {
  LoginPortkey: PortkeyEntries.SIGN_IN_ENTRY,
  SignupPortkey: PortkeyEntries.SIGN_UP_ENTRY,
  ScanLogin: PortkeyEntries.SCAN_LOG_IN,
  SetPin: PortkeyEntries.SET_PIN,
  ConfirmPin: PortkeyEntries.CONFIRM_PIN,
  SetBiometrics: PortkeyEntries.SET_BIO,
  CheckPin: PortkeyEntries.CHECK_PIN,
  AssetsHome: PortkeyEntries.ASSETS_HOME_ENTRY,
  GuardianApproval: PortkeyEntries.GUARDIAN_APPROVAL_ENTRY,
  VerifierDetails: PortkeyEntries.VERIFIER_DETAIL_ENTRY,
  GuardianDetail: PortkeyEntries.GUARDIAN_DETAIL_ENTRY,
  GuardianEdit: PortkeyEntries.ADD_GUARDIAN_ENTRY,
  SecurityLock: PortkeyEntries.SECURITY_LOCK_ENTRY,
  GuardianHome: PortkeyEntries.GUARDIAN_HOME_ENTRY,

  Receive: PortkeyEntries.RECEIVE_TOKEN_ENTRY,
  ActivityListPage: PortkeyEntries.ACTIVITY_LIST_ENTRY,
  ActivityDetail: PortkeyEntries.ACTIVITY_DETAIL_ENTRY,
  ViewOnWebView: PortkeyEntries.VIEW_ON_WEBVIEW,
  SendHome: PortkeyEntries.SEND_TOKEN_HOME_ENTRY,
  SendPreview: PortkeyEntries.SEND_TOKEN_CONFIRM_ENTRY,
  ManageTokenList: PortkeyEntries.TOKEN_MANAGE_LIST_ENTRY,
  CustomToken: PortkeyEntries.TOKEN_MANAGE_ADD_ENTRY,
  TokenDetail: PortkeyEntries.TOKEN_DETAIL_ENTRY,
  NFTDetail: PortkeyEntries.NFT_DETAIL_ENTRY,
  RampHome: PortkeyEntries.RAMP_HOME_ENTRY,
  RampPreview: PortkeyEntries.RAMP_PREVIEW_ENTRY,
  PaymentSecurityList: PortkeyEntries.PAYMENT_SECURITY_HOME_ENTRY,
  PaymentSecurityDetail: PortkeyEntries.PAYMENT_SECURITY_DETAIL_ENTRY,
  PaymentSecurityEdit: PortkeyEntries.PAYMENT_SECURITY_EDIT_ENTRY,
  ContactActivity: PortkeyEntries.CONTACT_ACTIVITY_ENTRY,
  QrScanner: PortkeyEntries.SCAN_QR_CODE,
  QrCodeResult: PortkeyEntries.QR_CODE_RESULT,
  Tab: PortkeyEntries.ASSETS_HOME_ENTRY,
  // SelectContact: PortkeyEntries.CONTACT_DETAIL_ENTRY,
};
const beforeWalletLoginPageArray = [
  PortkeyEntries.SIGN_IN_ENTRY,
  PortkeyEntries.SIGN_UP_ENTRY,
  PortkeyEntries.SCAN_LOG_IN,
  PortkeyEntries.SET_PIN,
  PortkeyEntries.CONFIRM_PIN,
  PortkeyEntries.SET_BIO,
  PortkeyEntries.GUARDIAN_APPROVAL_ENTRY,
  PortkeyEntries.VERIFIER_DETAIL_ENTRY,
  PortkeyEntries.SECURITY_LOCK_ENTRY,
];

export function mapRoute(appRouteName: AppRouteName) {
  return RouteNameMapping[appRouteName];
}

export function reverseMapRoute(sdkRouteName: PortkeyEntries) {
  const entry = Object.entries(RouteNameMapping).find(([key, val]) => val === sdkRouteName);
  return entry ? (entry[0] as AppRouteName) : undefined;
}
/**
 * if {@sdkRouteName} need pin to unlock, return true. otherwise false.
 */
export function isNeedUnlockPage(sdkRouteName: PortkeyEntries) {
  return !beforeWalletLoginPageArray.includes(sdkRouteName);
}
/**
 * if {@sdkRouteName} need pin to unlock, return true. otherwise false.
 */
export function isAlReadyLoginPage(sdkRouteName: PortkeyEntries) {
  return !beforeWalletLoginPageArray.includes(sdkRouteName);
}

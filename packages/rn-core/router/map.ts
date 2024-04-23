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
  | 'GuardianHome';

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

import TestPage from 'components/TestPage';
import GuardianApprovalEntryPage from 'components/entries/GuardianApproval';
import ReferralEntryPage from 'components/entries/Referral';
import SignInEntryPage from 'components/entries/SignIn';
import SelectCountryPage from 'components/entries/SelectCountry';
import SignUpEntryPage from 'components/entries/SignUp';
import SignUpReferralEntryPage from 'components/entries/SignUp/referral';
import VerifierDetailsEntryPage from 'components/entries/VerifierDetails';
import { PortkeyEntries } from 'config/entries';
import ViewOnWebView from 'pages/Activity/ViewOnWebView';
import AccountSettings from 'pages/My/AccountSettings';
import ScanLogin from 'pages/Login/ScanLogin';
import CheckPin from 'pages/Pin/CheckPin';
import ConfirmPin from 'pages/Pin/ConfirmPin';
import SetBiometrics from 'pages/Pin/SetBiometrics';
import SetPin from 'pages/Pin/SetPin';
import QrScanner from 'pages/QrScanner';
import GuardianHome from 'pages/GuardianManage/GuardianHome';
import { AppRegistry, ComponentProvider } from 'react-native';
import Biometric from 'pages/My/Biometric';

type AcceptableComponentType = ComponentProvider;

const initEntries = () => {
  const entryConfig = new Map<string, AcceptableComponentType>();
  entryConfig.set(PortkeyEntries.TEST, () => TestPage);

  // entry stage
  entryConfig.set(PortkeyEntries.REFERRAL_ENTRY, () => ReferralEntryPage);
  entryConfig.set(PortkeyEntries.SIGN_IN_ENTRY, () => SignInEntryPage);
  entryConfig.set(PortkeyEntries.SELECT_COUNTRY_ENTRY, () => SelectCountryPage);
  entryConfig.set(PortkeyEntries.SIGN_UP_ENTRY, () => SignUpEntryPage);
  entryConfig.set(PortkeyEntries.SIGN_UP_REFERRAL_ENTRY, () => SignUpReferralEntryPage);

  // verify stage
  entryConfig.set(PortkeyEntries.VERIFIER_DETAIL_ENTRY, () => VerifierDetailsEntryPage);
  entryConfig.set(PortkeyEntries.GUARDIAN_APPROVAL_ENTRY, () => GuardianApprovalEntryPage);

  // pin service stage
  entryConfig.set(PortkeyEntries.CHECK_PIN, () => CheckPin);
  entryConfig.set(PortkeyEntries.SET_PIN, () => SetPin);
  entryConfig.set(PortkeyEntries.CONFIRM_PIN, () => ConfirmPin);
  entryConfig.set(PortkeyEntries.SET_BIO, () => SetBiometrics);

  // scan QR code
  entryConfig.set(PortkeyEntries.SCAN_QR_CODE, () => QrScanner);
  entryConfig.set(PortkeyEntries.SCAN_LOG_IN, () => ScanLogin);

  // guardian manage
  entryConfig.set(PortkeyEntries.GUARDIAN_HOME_ENTRY, () => GuardianHome);

  // webview
  entryConfig.set(PortkeyEntries.VIEW_ON_WEBVIEW, () => ViewOnWebView);

  entryConfig.set(PortkeyEntries.ACCOUNT_SETTING_ENTRY, () => AccountSettings);
  entryConfig.set(PortkeyEntries.BIOMETRIC_SWITCH_ENTRY, () => Biometric);

  for (const [key, value] of entryConfig) {
    AppRegistry.registerComponent(key, value);
  }
};
export enum LanuchMode {
  STANDARD = 'standard',
  SINGLE_TASK = 'single_task',
  SINGLE_TOP = 'single_top',
}
const registerLaunchMode = () => {
  LaunchModeSet.set(PortkeyEntries.ACCOUNT_SETTING_ENTRY, LanuchMode.SINGLE_TASK.toString());
};
export const LaunchModeSet = new Map();
export { initEntries, registerLaunchMode };

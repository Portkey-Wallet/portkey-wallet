import TestPage from 'components/TestPage';
import GuardianApprovalEntryPage from 'components/entries/GuardianApproval';
import ReferralEntryPage from 'components/entries/Referral';
import SignInEntryPage from 'components/entries/SignIn';
import SelectCountryPage from 'components/entries/SelectCountry';
import SignUpEntryPage from 'components/entries/SignUp';
import VerifierDetailsEntryPage from 'components/entries/VerifierDetails';
import { PortkeyEntries } from 'config/entries';
import ViewOnWebView from 'pages/Activity/ViewOnWebView';
import ScanLogin from 'pages/Login/ScanLogin';
import CheckPin from 'pages/Pin/CheckPin';
import ConfirmPin from 'pages/Pin/ConfirmPin';
import SetBiometrics from 'pages/Pin/SetBiometrics';
import SetPin from 'pages/Pin/SetPin';
import QrScanner from 'pages/QrScanner';
import { AppRegistry, ComponentProvider } from 'react-native';

type AcceptableComponentType = ComponentProvider;

const initEntries = () => {
  const entryConfig = new Map<string, AcceptableComponentType>();
  entryConfig.set(PortkeyEntries.TEST, () => TestPage);

  // entry stage
  entryConfig.set(PortkeyEntries.REFERRAL_ENTRY, () => ReferralEntryPage);
  entryConfig.set(PortkeyEntries.SIGN_IN_ENTRY, () => SignInEntryPage);
  entryConfig.set(PortkeyEntries.SELECT_COUNTRY_ENTRY, () => SelectCountryPage);
  entryConfig.set(PortkeyEntries.SIGN_UP_ENTRY, () => SignUpEntryPage);

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

  // webview
  entryConfig.set(PortkeyEntries.VIEW_ON_WEBVIEW, () => ViewOnWebView);

  for (const [key, value] of entryConfig) {
    AppRegistry.registerComponent(key, value);
  }
};

export { initEntries };

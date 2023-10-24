import { AppRegistry, Platform } from 'react-native';
import { PortkeyEntries } from './js/config/entries';
import TestPage from './js/components/TestPage';
import { initJSModules } from './js/service/JsModules';
import SignInEntryPage from 'components/entries/SignIn';
import SelectCountryPage from 'components/entries/SelectCountry';
import SignUpEntryPage from 'components/entries/SignUp';
import ReferralEntryPage from 'components/entries/Referral';
import GuardianApprovalEntryPage from 'components/entries/GuardianApproval';
import VerifierDetailsEntryPage from 'components/entries/VerifierDetails';
import CheckPin from 'pages/Pin/check-pin';
import SetPin from 'pages/Pin/SetPin';
import ConfirmPin from 'pages/Pin/confirm-pin';
import SetBiometrics from 'pages/Pin/set-biometrics';
import ViewOnWebView from 'pages/Activity/ViewOnWebView';
import { PortkeyBackgroundTasks } from 'config/tasks';
import { handleBackgroundTask } from 'service/JsModules/BackgroundTasks';

const entryConfig = new Map();
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

// webview
entryConfig.set(PortkeyEntries.VIEW_ON_WEBVIEW, () => ViewOnWebView);

for (const [key, value] of entryConfig) {
  AppRegistry.registerComponent(key, value);
}

initJSModules();

if (Platform.OS === 'android') {
  const taskConfig = new Map();
  taskConfig.set(PortkeyBackgroundTasks.CALL_GENERAL_JS_METHOD, () => handleBackgroundTask);
  for (const [key, value] of taskConfig) {
    AppRegistry.registerHeadlessTask(key, value);
  }
}

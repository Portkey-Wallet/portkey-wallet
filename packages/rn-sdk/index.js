import { AppRegistry } from 'react-native';
import { PortkeyEntries } from './js/config/entries';
import TestPage from './js/components/TestPage';
import { initJSModules } from './js/service/js-modules';
import SignInEntryPage from 'components/entries/sign-in/SignInEntryPage';
import SelectCountryPage from 'components/entries/SelectCountry';
import SignUpEntryPage from 'components/entries/SignUp';
import ReferralEntryPage from 'components/entries/Referral';
import GuardianApprovalEntryPage from 'components/entries/GuardianApproval';
import VerifierDetailsEntryPage from 'components/entries/VerifierDetails';
import CheckPin from 'pages/Pin/check-pin';

const entryConfig = new Map();
entryConfig.set(PortkeyEntries.TEST, () => TestPage);
entryConfig.set(PortkeyEntries.REFERRAL_ENTRY, () => ReferralEntryPage);
entryConfig.set(PortkeyEntries.SIGN_IN_ENTRY, () => SignInEntryPage);
entryConfig.set(PortkeyEntries.SELECT_COUNTRY_ENTRY, () => SelectCountryPage);
entryConfig.set(PortkeyEntries.SIGN_UP_ENTRY, () => SignUpEntryPage);
entryConfig.set(PortkeyEntries.GUARDIAN_APPROVAL_ENTRY, () => GuardianApprovalEntryPage);

entryConfig.set(PortkeyEntries.CHECK_PIN, () => CheckPin);
entryConfig.set(PortkeyEntries.VERIFIER_DETAIL_ENTRY, () => VerifierDetailsEntryPage);

for (const [key, value] of entryConfig) {
  AppRegistry.registerComponent(key, value);
}

initJSModules();

import { AppRegistry } from 'react-native';
import { PortkeyEntries } from './js/config/entries';
import TestPage from './js/components/TestPage';
import { initJSModules } from './js/service/js-modules';
import SignInEntryPage from 'components/entries/sign-in/SignInEntryPage';
import SelectCountryPage from 'components/entries/SelectCountry';
import SignUpEntryPage from 'components/entries/SignUp';
import ReferralEntryPage from 'components/entries/Referral';

type EntryConfig = Map<string, any>;

const entryConfig: EntryConfig = new Map();
entryConfig.set(PortkeyEntries.TEST, () => TestPage);
entryConfig.set(PortkeyEntries.REFERRAL_ENTRY, () => ReferralEntryPage);
entryConfig.set(PortkeyEntries.SIGN_IN_ENTRY, () => SignInEntryPage);
entryConfig.set(PortkeyEntries.SELECT_COUNTRY_ENTRY, () => SelectCountryPage);
entryConfig.set(PortkeyEntries.SIGN_UP_ENTRY, () => SignUpEntryPage);

for (const [key, value] of entryConfig) {
  AppRegistry.registerComponent(key, value);
}

initJSModules();

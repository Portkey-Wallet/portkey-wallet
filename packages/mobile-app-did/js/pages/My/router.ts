import WalletSecurityNav from './WalletSecurity/router';
import WalletHomeNav from './WalletHome/router';
import accountSettingsNav from './AccountSettings/router';
import ContactsNav from './Contacts/index';
import GuardianNav from './Guardian/index';
import UserReferral from './UserReferral/index';

const stackNav = [
  ...WalletSecurityNav,
  ...WalletHomeNav,
  ...accountSettingsNav,
  ...ContactsNav,
  ...GuardianNav,
  { name: 'UserReferral', component: UserReferral },
] as const;

export default stackNav;

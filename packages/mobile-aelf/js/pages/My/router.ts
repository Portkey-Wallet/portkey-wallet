import WalletSecurityNav from './WalletSecurity/router';
import WalletHomeNav from './WalletHome/router';
import accountSettingsNav from './AccountSettings/router';
import ContactsNav from './Contacts/index';
import GuardianNav from './Guardian/index';
import UserReferral from './UserReferral/index';
import { WalletManagementNav } from './WalletManagement/router';

// import SecurityNav from './Security/router';

const stackNav = [
  // ...SecurityNav,
  ...WalletSecurityNav,
  ...WalletHomeNav,
  ...accountSettingsNav,
  ...ContactsNav,
  ...GuardianNav,
  { name: 'UserReferral', component: UserReferral },
  ...WalletManagementNav,
] as const;

export default stackNav;

import WalletSecurity from './index';
import DeviceNav from './Device/router';
import PaymentSecurityNav from './PaymentSecurity/router';
import SecondaryMailboxHome from './SecondaryMailbox';
import SecondaryMailboxEdit from './SecondaryMailbox/SecondaryMailboxEdit';
import VerifierEmail from './SecondaryMailbox/VerifierEmail';

const stackNav = [
  {
    name: 'WalletSecurity',
    component: WalletSecurity,
  },
  {
    name: 'SecondaryMailboxHome',
    component: SecondaryMailboxHome,
  },
  {
    name: 'SecondaryMailboxEdit',
    component: SecondaryMailboxEdit,
  },
  {
    name: 'VerifierEmail',
    component: VerifierEmail,
  },
  ...DeviceNav,
  ...PaymentSecurityNav,
] as const;

export default stackNav;

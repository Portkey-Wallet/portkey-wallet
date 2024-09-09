import WalletSecurity from '.';
import DeviceNav from './Device/router';
import DappNav from './Dapp/router';
import PaymentSecurityNav from './PaymentSecurity/router';
import TokenAllowanceNav from './TokenAllowance/router';
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
  ...DappNav,
  ...DeviceNav,
  ...PaymentSecurityNav,
  ...TokenAllowanceNav,
] as const;

export default stackNav;

import WalletSecurity from '.';
import DeviceNav from './Device/router';
import DappNav from './Dapp/router';
import PaymentSecurityNav from './PaymentSecurity/router';
import TokenAllowanceNav from './TokenAllowance/router';

const stackNav = [
  {
    name: 'WalletSecurity',
    component: WalletSecurity,
  },
  ...DappNav,
  ...DeviceNav,
  ...PaymentSecurityNav,
  ...TokenAllowanceNav,
] as const;

export default stackNav;

import WalletSecurity from '.';
import DeviceNav from './Device/router';
import DappNav from './Dapp/router';
import PaymentSecurityNav from './PaymentSecurity/router';

const stackNav = [
  {
    name: 'WalletSecurity',
    component: WalletSecurity,
  },
  ...DappNav,
  ...DeviceNav,
  ...PaymentSecurityNav,
] as const;

export default stackNav;

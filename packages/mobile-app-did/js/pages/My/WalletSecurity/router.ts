import WalletSecurity from '.';
import DeviceNav from './Device/router';
import DappNav from './Dapp/router';

const stackNav = [
  {
    name: 'WalletSecurity',
    component: WalletSecurity,
  },
  ...DappNav,
  ...DeviceNav,
] as const;

export default stackNav;

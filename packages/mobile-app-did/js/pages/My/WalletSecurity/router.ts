import WalletSecurity from '.';
import DeviceNav from './Device/router';
import Dapp from './Dapp/index';

const stackNav = [
  {
    name: 'WalletSecurity',
    component: WalletSecurity,
  },
  {
    name: 'ConnectedSites',
    component: Dapp,
  },
  ...DeviceNav,
] as const;

export default stackNav;

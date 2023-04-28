import WalletSecurity from '.';
import DeviceNav from './Device/router';

const stackNav = [
  {
    name: 'WalletSecurity',
    component: WalletSecurity,
  },
  ...DeviceNav,
] as const;

export default stackNav;

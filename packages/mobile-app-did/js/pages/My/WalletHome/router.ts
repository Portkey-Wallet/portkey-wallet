import WalletHome from '.';
import WalletName from './WalletName';
import AutoLock from './AutoLock';
import SwitchNetworks from './SwitchNetworks';
import AboutUs from './AboutUs';

const stackNav = [
  {
    name: 'WalletHome',
    component: WalletHome,
  },
  {
    name: 'WalletName',
    component: WalletName,
  },
  {
    name: 'AutoLock',
    component: AutoLock,
  },
  {
    name: 'SwitchNetworks',
    component: SwitchNetworks,
  },
  {
    name: 'AboutUs',
    component: AboutUs,
  },
] as const;

export default stackNav;

import WalletHome from '.';
import WalletName from './WalletName';
import MyWallet from './MyWallet';
import EditWalletName from './EditWalletName';

import AutoLock from './AutoLock';
import SwitchNetworks from './SwitchNetworks';
import AboutUs from './AboutUs';
import AccountCancelation from './AccountCancelation';
import PhotoScreen from './CameraPage';

const stackNav = [
  {
    name: 'PhotoScreen',
    component: PhotoScreen,
  },
  {
    name: 'WalletHome',
    component: WalletHome,
  },
  {
    name: 'WalletName',
    component: MyWallet,
  },
  {
    name: 'EditWalletName',
    component: EditWalletName,
  },
  {
    name: 'SwitchNetworks',
    component: SwitchNetworks,
  },
  {
    name: 'AboutUs',
    component: AboutUs,
  },
  {
    name: 'AccountCancelation',
    component: AccountCancelation,
  },
] as const;

export default stackNav;

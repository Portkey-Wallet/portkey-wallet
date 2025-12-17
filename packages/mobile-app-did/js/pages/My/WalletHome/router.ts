import MyWallet from './MyWallet';
import WalletHome from './index';
import EditWalletName from './EditWalletName';

// import SwitchNetworks from './SwitchNetworks';
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
  // {
  //   name: 'SwitchNetworks',
  //   component: SwitchNetworks,
  // },
  {
    name: 'AccountCancelation',
    component: AccountCancelation,
  },
] as const;

export default stackNav;

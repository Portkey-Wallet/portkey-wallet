import WalletManagement from './index';
import CreateNewWalletNote from './CreateNewWalletNote';
import { AddressDetail } from './AddressDetail';
import ResetApp from './ResetApp';

export const WalletManagementNav = [
  {
    name: 'WalletManagement',
    component: WalletManagement,
  },
  {
    name: 'CreateNewWalletNote',
    component: CreateNewWalletNote,
  },
  {
    name: 'AddressDetail',
    component: AddressDetail,
  },
  {
    name: 'ResetApp',
    component: ResetApp,
  },
] as const;

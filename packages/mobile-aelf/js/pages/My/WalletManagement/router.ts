import WalletManagement from './index';
import CreateNewWalletNote from './CreateNewWalletNote';
import { AddressDetail } from './AddressDetail';

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
] as const;

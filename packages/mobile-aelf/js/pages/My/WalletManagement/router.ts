import WalletManagement from './index';
import CreateNewWalletNote from './CreateNewWalletNote';

export const WalletManagementNav = [
  {
    name: 'WalletManagement',
    component: WalletManagement,
  },
  {
    name: 'CreateNewWalletNote',
    component: CreateNewWalletNote,
  },
] as const;

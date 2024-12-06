import { TAccountInfo, TWalletInfo } from '@portkey-wallet/types/types-eoa/wallet';

export type TWalletState = {
  walletList: TWalletInfo[];
  privateKeyAccountList: TAccountInfo[];
  currentAccountAddress?: TAccountInfo['address'];
};

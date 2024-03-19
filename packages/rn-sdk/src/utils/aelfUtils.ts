import AElf from 'aelf-sdk';
import { DEFAULT_VIEW_PRIVATE_KEY } from 'constants/common';
const { wallet: Wallet } = AElf;
const wallet = Wallet.getWalletByPrivateKey(DEFAULT_VIEW_PRIVATE_KEY);

export function getDefaultWallet() {
  return wallet;
}

import AElf from 'aelf-sdk';
const { wallet: Wallet } = AElf;
import { COMMON_PRIVATE } from '@portkey-wallet/constants';

const DefaultViewWallet = Wallet.getWalletByPrivateKey(COMMON_PRIVATE);

export function getDefaultWallet() {
  return DefaultViewWallet;
}

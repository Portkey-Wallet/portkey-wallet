import AElf from 'aelf-sdk';
import { sleep } from '@portkey-wallet/utils';
const { wallet: Wallet } = AElf;
const wallet = Wallet.getWalletByPrivateKey('28805dd286a972f0ff268ba42646d5d952d770141bfec55c98e10619c268ecea');

export function getDefaultWallet() {
  return wallet;
}

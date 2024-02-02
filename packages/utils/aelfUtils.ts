import AElf from 'aelf-sdk';
import { Buffer } from 'buffer';
const { wallet: Wallet } = AElf;
const wallet = Wallet.getWalletByPrivateKey('28805dd286a972f0ff268ba42646d5d952d770141bfec55c98e10619c268ecea');
const instance = new AElf(new AElf.providers.HttpProvider('http://192.168.67.47:8000'));
const TOKEN_CONTRACT = 'JRmBduh4nXWi1aXgdUsj5gJrzeZb2LxmrAbf7W99faZSvoAaE';
export async function getTokenInfo(symbol: string) {
  const tokenContract = await instance.chain.contractAt(TOKEN_CONTRACT, wallet);
  return tokenContract.GetTokenInfo.call({ symbol });
}

export function getDefaultWallet() {
  return wallet;
}

export async function getBalance({ symbol }: { symbol: string }) {
  const tokenContract = await instance.chain.contractAt(TOKEN_CONTRACT, wallet);
  return tokenContract.GetBalance.call({ symbol, owner: wallet.address });
}

export async function sign() {
  return Wallet.sign(Buffer.from('1').toString('hex'), wallet.keyPair).toString('base64');
}
export async function createNewWallet() {
  return AElf.wallet.createNewWallet();
}

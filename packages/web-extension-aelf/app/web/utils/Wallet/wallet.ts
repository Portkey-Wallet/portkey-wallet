import { removeLocalStorage } from 'utils/storage/chromeStorage';

export default class WalletUtil {
  // static async getWalletInfo() {
  //   const res = (await getLocalStorage('walletInfo')) || '{}';
  //   return JSON.parse(res);
  // }

  static async clearWallet() {
    await removeLocalStorage(['walletInfoMap']);
  }
}

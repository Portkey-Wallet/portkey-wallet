import { Accounts, ChainId, ChainIds, ChainsInfo } from '@portkey/provider-types';
import { getDappState, getWalletState } from 'utils/lib/SWGetReduxStore';

export class ExtensionDappManager {
  async getWallet() {
    return getWalletState();
  }

  async getDapp() {
    return getDappState();
  }
  /** @deprecated */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async addDapp(..._args: any[]) {
    // if (typeof window !== 'undefined') {
    //   const wallet = await this.getWallet();
    //   if (!wallet) throw 'Please confirm whether to log in';
    //   // const { currentNetwork } = this.store.dispatch(addDapp({ networkType: currentNetwork, dapp: dapp }));
    // } else {
    throw new Error('window is undefined');
    // }
  }

  async getCurrentCAInfo() {
    const { walletInfo, currentNetwork } = await this.getWallet();
    return walletInfo?.caInfo[currentNetwork];
  }

  async isLogged() {
    const { walletInfo, currentNetwork, originChainId } = await this.getWallet();
    return !!(originChainId && walletInfo?.caInfo[currentNetwork]?.[originChainId]?.caAddress);
  }
  async isActive(origin: string) {
    const isAuth = await this.originIsAuthorized(origin);
    const isLog = await this.isLogged();
    return isAuth && isLog;
  }
  async originIsAuthorized(origin: string) {
    const wallet = await this.getWallet();
    const dapp = await this.getDapp();
    return !!dapp.dappList?.[wallet.currentNetwork]?.some((item) => item.origin === origin);
  }
  async accounts(origin: string) {
    const { walletInfo, currentNetwork } = await this.getWallet();
    if (!this.isActive(origin)) return {};
    const obj: Accounts = {};
    Object.entries(walletInfo?.caInfo[currentNetwork] || {}).forEach(([key, value]) => {
      if ((value as any)?.caAddress) {
        obj[key as ChainId] = [(value as any)?.caAddress];
      }
    });
    return obj;
  }
  chainId() {
    return this.chainIds();
  }
  async chainIds() {
    if (!this.isLogged()) return [];
    const currentCAInfo = await this.getCurrentCAInfo();
    const list = Object.entries(currentCAInfo || {})
      .map(([key, value]): any => {
        if ((value as any)?.caAddress) return key;
      })
      .filter((i) => !!i);
    return list as ChainIds;
  }
  async chainsInfo() {
    const { chainInfo, currentNetwork } = await this.getWallet();
    const obj: ChainsInfo = {};
    chainInfo?.[currentNetwork]?.forEach((chainInfo) => {
      obj[chainInfo.chainId] = [chainInfo];
    });
    return obj;
  }
}

import { addDapp } from '@portkey-wallet/store/store-ca/dapp/actions';
import { DappStoreItem } from '@portkey-wallet/store/store-ca/dapp/type';
import { DappManagerOptions, IDappManager, IDappManagerStore } from '@portkey-wallet/types/types-ca/dapp';
import { Accounts, ChainId, ChainIds, ChainsInfo } from '@portkey/provider-types';

export class DappManager implements IDappManager {
  protected store: IDappManagerStore;
  constructor(options: DappManagerOptions) {
    this.store = options.store;
  }
  getWallet() {
    return this.store.getState().wallet;
  }
  getCurrentCAInfo() {
    const { walletInfo, currentNetwork } = this.getWallet();
    return walletInfo?.caInfo[currentNetwork];
  }
  addDapp(dapp: DappStoreItem) {
    const { currentNetwork } = this.getWallet();
    this.store.dispatch(addDapp({ networkType: currentNetwork, dapp: dapp }));
  }
  isLogged(): boolean {
    const { walletInfo, currentNetwork, originChainId } = this.getWallet();
    return !!(originChainId && walletInfo?.caInfo[currentNetwork]?.[originChainId]?.caAddress);
  }
  isActive(origin: string) {
    return this.originIsAuthorized(origin) && this.isLogged();
  }
  originIsAuthorized(origin: string): boolean {
    const { wallet, dapp } = this.store.getState();
    return !!dapp.dappList?.[wallet.currentNetwork]?.some(item => item.origin === origin);
  }
  accounts(origin: string) {
    const { walletInfo, currentNetwork } = this.getWallet();
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
  chainIds() {
    if (!this.isLogged()) return [];
    const currentCAInfo = this.getCurrentCAInfo();
    const list = Object.entries(currentCAInfo || {})
      .map(([key, value]) => {
        if ((value as any)?.caAddress) return key;
      })
      .filter(i => !!i);
    return list as ChainIds;
  }
  chainsInfo() {
    const { chainInfo, currentNetwork } = this.getWallet();
    const obj: ChainsInfo = {};
    chainInfo?.[currentNetwork]?.forEach(chainInfo => {
      obj[chainInfo.chainId] = [chainInfo];
    });
    return obj;
  }
}

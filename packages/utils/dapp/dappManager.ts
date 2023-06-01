import { addDapp } from '@portkey-wallet/store/store-ca/dapp/actions';
import { DappStoreItem } from '@portkey-wallet/store/store-ca/dapp/type';
import { ChainItemType } from '@portkey-wallet/store/store-ca/wallet/type';
import { DappManagerOptions, IDappManager, IDappManagerStore } from '@portkey-wallet/types/types-ca/dapp';
import { CACommonState } from '@portkey-wallet/types/types-ca/store';
import { CAInfo } from '@portkey-wallet/types/types-ca/wallet';
import { Accounts, ChainId, ChainIds, ChainsInfo } from '@portkey/provider-types';

export abstract class BaseDappManager<T extends IDappManagerStore> {
  protected store: T;
  constructor(options: DappManagerOptions<T>) {
    this.store = options.store;
  }
}

export abstract class DappManager<T extends CACommonState = CACommonState>
  extends BaseDappManager<IDappManagerStore<T>>
  implements IDappManager<T>
{
  async getState(): Promise<T> {
    return this.store.getState();
  }
  abstract isLocked(): Promise<boolean>;

  async getWallet() {
    return (await this.getState()).wallet;
  }
  async getCurrentCAInfo() {
    const { walletInfo, currentNetwork } = await this.getWallet();
    return walletInfo?.caInfo[currentNetwork];
  }
  async getCaInfo(chainId: ChainId): Promise<CAInfo | undefined> {
    return (await this.getCurrentCAInfo())?.[chainId];
  }
  async getCurrentChainList() {
    const { chainInfo, currentNetwork } = await this.getWallet();
    return chainInfo?.[currentNetwork];
  }
  async getChainInfo(chainId: ChainId): Promise<ChainItemType | undefined> {
    return (await this.getCurrentChainList())?.find(info => info.chainId === chainId);
  }
  async addDapp(dapp: DappStoreItem) {
    const { currentNetwork } = await this.getWallet();
    this.store.dispatch(addDapp({ networkType: currentNetwork, dapp: dapp }));
  }
  async isLogged(): Promise<boolean> {
    const { walletInfo, currentNetwork, originChainId } = await this.getWallet();
    return !!(originChainId && walletInfo?.caInfo[currentNetwork]?.managerInfo);
  }
  async isActive(origin: string) {
    return (await this.originIsAuthorized(origin)) && (await this.isLogged());
  }
  async originIsAuthorized(origin: string): Promise<boolean> {
    const { wallet, dapp } = await this.getState();
    return !!dapp.dappMap?.[wallet.currentNetwork]?.some(item => item.origin === origin);
  }
  async accounts(origin: string) {
    const { walletInfo, currentNetwork } = await this.getWallet();
    if (!this.isActive(origin) || !walletInfo?.caInfo) return {};
    const accounts: Accounts = {};
    Object.entries(walletInfo.caInfo[currentNetwork] || {}).forEach(([key, value]) => {
      if ((value as CAInfo)?.caAddress) accounts[key as ChainId] = [(value as CAInfo).caAddress];
    });
    return accounts;
  }
  async chainId() {
    return this.chainIds();
  }
  async chainIds() {
    if (!this.isLogged()) return [];
    const currentCAInfo = await this.getCurrentCAInfo();
    const list = Object.entries(currentCAInfo || {})
      .map(([key, value]) => {
        if ((value as CAInfo)?.caAddress) return key;
        return undefined;
      })
      .filter(i => !!i);
    return list as ChainIds;
  }
  async chainsInfo() {
    const chainsInfo: ChainsInfo = {};
    (await this.getCurrentChainList())?.forEach(chainInfo => {
      chainsInfo[chainInfo.chainId] = [chainInfo];
    });
    return chainsInfo;
  }
  async getRpcUrl(chainId: ChainId): Promise<string | undefined> {
    return (await this.getChainInfo(chainId))?.endPoint;
  }
}

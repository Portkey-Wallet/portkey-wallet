import { addDapp, updateDapp } from '@portkey-wallet/store/store-ca/dapp/actions';
import { DappStoreItem } from '@portkey-wallet/store/store-ca/dapp/type';
import { ChainItemType } from '@portkey-wallet/store/store-ca/wallet/type';
import { DappManagerOptions, IDappManager, IDappManagerStore } from '@portkey-wallet/types/types-ca/dapp';
import { CACommonState } from '@portkey-wallet/types/types-ca/store';
import { CAInfo } from '@portkey-wallet/types/types-ca/wallet';
import { ChainId, ChainsInfo } from '@portkey/provider-types';
import { handleAccounts, handleChainIds, handleCurrentCAInfo } from './index';
import { isEqDapp } from './browser';

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
  async getOriginInfo(origin: string): Promise<DappStoreItem | undefined> {
    const { wallet, dapp } = await this.getState();
    return dapp.dappMap?.[wallet.currentNetwork]?.find(item => item.origin === origin);
  }
  async originIsAuthorized(origin: string): Promise<boolean> {
    return !!(await this.getOriginInfo(origin));
  }
  async getCurrentCAInfo() {
    const wallet = await this.getWallet();
    return handleCurrentCAInfo(wallet);
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
  async updateDapp(dapp: DappStoreItem): Promise<void> {
    const { currentNetwork } = await this.getWallet();
    const originInfo = await this.getOriginInfo(dapp.origin);
    if (isEqDapp(dapp, originInfo)) return;
    this.store.dispatch(updateDapp({ origin: dapp.origin, networkType: currentNetwork, dapp: dapp }));
  }
  async isLogged(): Promise<boolean> {
    const { walletInfo, currentNetwork, originChainId } = await this.getWallet();
    return !!(originChainId && walletInfo?.caInfo[currentNetwork]?.managerInfo);
  }
  async isActive(origin: string) {
    return (await this.originIsAuthorized(origin)) && (await this.isLogged());
  }
  async accounts(origin: string) {
    const wallet = await this.getWallet();
    if (!(await this.isActive(origin)) || !wallet.walletInfo?.caInfo) return {};
    return handleAccounts(wallet);
  }
  async chainId() {
    return this.chainIds();
  }
  async chainIds() {
    if (!this.isLogged()) return [];
    const wallet = await this.getWallet();
    return handleChainIds(wallet);
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

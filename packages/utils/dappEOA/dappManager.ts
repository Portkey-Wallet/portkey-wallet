import { addDapp, updateDapp } from '@portkey-wallet/store/store-eoa/dapp/actions';
import { DappStoreItem } from '@portkey-wallet/store/store-eoa/dapp/type';
import { DappManagerOptions, IDappManager, IDappManagerStore } from '@portkey-wallet/types/types-eoa/dapp';
import { EOACommonState } from '@portkey-wallet/types/types-eoa/store';
import { ChainId, ChainsInfo } from '@portkey/provider-types';
import { handleAccounts, handleChainIds, handleCurrentAccount, handleCurrentWallet, handleOriginInfo } from './index';
import { isEqDapp } from './browser';
import { NetworkType } from '@portkey-wallet/types';
import { SessionInfo } from '@portkey-wallet/types/session';
import { IChainItemType } from '@portkey-wallet/types/types-eoa/chain';
import { TAccountInfo } from '@portkey-wallet/types/types-eoa/wallet';

export abstract class BaseDappManager<T extends IDappManagerStore> {
  protected store: T;
  constructor(options: DappManagerOptions<T>) {
    this.store = options.store;
  }
}

export abstract class DappManager<T extends EOACommonState = EOACommonState>
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
  async getNetwork() {
    return (await this.getState()).network;
  }
  // ==>current account name
  async walletName(): Promise<string> {
    const wallet = await this.getWallet();
    const currentAccount = handleCurrentAccount(wallet);
    return currentAccount?.name || '';
  }
  // ==> current account
  async walletInfo(): Promise<TAccountInfo | undefined> {
    const wallet = await this.getWallet();
    const currentAccount = handleCurrentAccount(wallet);
    return currentAccount;
  }
  async networkType(): Promise<NetworkType> {
    return (await this.getNetwork()).currentNetwork;
  }
  async getOriginInfo(origin: string): Promise<DappStoreItem | undefined> {
    const { dapp } = await this.getState();
    const currentNetwork = await this.networkType();
    return handleOriginInfo({ currentNetwork, dapp, origin });
  }
  async originIsAuthorized(origin: string): Promise<boolean> {
    return !!(await this.getOriginInfo(origin));
  }
  async getCurrentChainList() {
    const { chainListMap, currentNetwork } = await this.getNetwork();
    return chainListMap?.[currentNetwork];
  }
  async getChainInfo(chainId: ChainId): Promise<IChainItemType | undefined> {
    return (await this.getCurrentChainList())?.find(info => info.chainId === chainId);
  }
  async addDapp(dapp: DappStoreItem) {
    const { currentNetwork } = await this.getNetwork();
    this.store.dispatch(addDapp({ networkType: currentNetwork, dapp: dapp }));
  }
  async updateDapp(dapp: DappStoreItem): Promise<void> {
    const [{ currentNetwork }, originInfo] = await Promise.all([this.getNetwork(), this.getOriginInfo(dapp.origin)]);
    if (isEqDapp(dapp, originInfo)) return;
    this.store.dispatch(updateDapp({ origin: dapp.origin, networkType: currentNetwork, dapp: dapp }));
  }

  async isLogged(): Promise<boolean> {
    const currentAccount = await this.walletInfo();
    return !!currentAccount;
  }

  async isActive(origin: string) {
    return (await this.originIsAuthorized(origin)) && (await this.isLogged());
  }

  async accounts(origin: string) {
    const [wallet, networkInfo, active] = await Promise.all([
      this.getWallet(),
      this.getNetwork(),
      this.isActive(origin),
    ]);
    if (!active || !networkInfo || !wallet) return {};
    return handleAccounts(wallet, networkInfo);
  }

  async chainId() {
    return this.chainIds();
  }
  async chainIds() {
    if (!this.isLogged()) return [];
    const networkInfo = await this.getNetwork();
    return handleChainIds(networkInfo);
  }
  async chainsInfo() {
    const chainsInfo: ChainsInfo = {};
    (await this.getCurrentChainList())?.forEach(chainInfo => {
      const tmpChainInfo: any = { ...chainInfo };
      tmpChainInfo.lastModifyTime && delete tmpChainInfo.lastModifyTime;
      tmpChainInfo.id && delete tmpChainInfo.id;
      chainsInfo[chainInfo.chainId] = [tmpChainInfo];
    });
    return chainsInfo;
  }
  async getRpcUrl(chainId: ChainId): Promise<string | undefined> {
    return (await this.getChainInfo(chainId))?.endPoint;
  }
  async getSessionInfo(origin: string): Promise<SessionInfo | undefined> {
    const originInfo = await this.getOriginInfo(origin);
    return originInfo?.sessionInfo;
  }
  async getRememberMeBlackList(): Promise<string[] | undefined> {
    const [currentNetwork, state] = await Promise.all([this.networkType(), this.getState()]);
    return state.cms.rememberMeBlackListMap?.[currentNetwork]?.map(({ url }) => url);
  }
}

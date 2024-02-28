import { addDapp, updateDapp } from '@portkey-wallet/store/store-ca/dapp/actions';
import { DappStoreItem } from '@portkey-wallet/store/store-ca/dapp/type';
import { ChainItemType } from '@portkey-wallet/store/store-ca/wallet/type';
import { DappManagerOptions, IDappManager, IDappManagerStore } from '@portkey-wallet/types/types-ca/dapp';
import { CACommonState } from '@portkey-wallet/types/types-ca/store';
import { CAInfo, CAWalletInfoType } from '@portkey-wallet/types/types-ca/wallet';
import { ChainId, ChainsInfo } from '@portkey/provider-types';
import { handleAccounts, handleChainIds, handleCurrentCAInfo, handleOriginInfo } from './index';
import { isEqDapp } from './browser';
import { NetworkType } from '@portkey-wallet/types';
import { DefaultChainId } from '@portkey-wallet/constants/constants-ca/network';
import { SessionInfo } from '@portkey-wallet/types/session';
import { updateCASyncState } from '@portkey-wallet/store/store-ca/wallet/actions';

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
  async caHash(): Promise<string> {
    const currentCAInfo = await this.getCurrentCAInfo();
    return Object.values<CAInfo>(currentCAInfo as any).filter(i => i?.caHash)[0]?.caHash || '';
  }
  async getState(): Promise<T> {
    return this.store.getState();
  }
  abstract isLocked(): Promise<boolean>;

  async getWallet() {
    return (await this.getState()).wallet;
  }
  async walletName(): Promise<string> {
    return (await this.getWallet()).walletName;
  }
  async walletInfo(): Promise<CAWalletInfoType | undefined> {
    return (await this.getWallet()).walletInfo;
  }
  async currentManagerAddress(): Promise<string | undefined> {
    return (await this.walletInfo())?.address;
  }
  async networkType(): Promise<NetworkType> {
    return (await this.getWallet()).currentNetwork;
  }
  async getOriginInfo(origin: string): Promise<DappStoreItem | undefined> {
    const { wallet, dapp } = await this.getState();
    return handleOriginInfo({ wallet, dapp, origin });
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
  async updateManagerSyncState(chainId: ChainId) {
    const { currentNetwork } = await this.getWallet();
    this.store.dispatch(updateCASyncState({ networkType: currentNetwork, chainId }));
  }
  async updateDapp(dapp: DappStoreItem): Promise<void> {
    const [{ currentNetwork }, originInfo] = await Promise.all([this.getWallet(), this.getOriginInfo(dapp.origin)]);
    if (isEqDapp(dapp, originInfo)) return;
    this.store.dispatch(updateDapp({ origin: dapp.origin, networkType: currentNetwork, dapp: dapp }));
  }

  async getOriginChainId() {
    const [{ originChainId: walletOriginChainId }, currentCAInfo] = await Promise.all([
      this.getWallet(),
      this.getCurrentCAInfo(),
    ]);
    return currentCAInfo?.originChainId || walletOriginChainId || DefaultChainId;
  }

  async isLogged(): Promise<boolean> {
    const [{ walletInfo, currentNetwork }, originChainId] = await Promise.all([
      this.getWallet(),
      this.getOriginChainId(),
    ]);
    return !!(originChainId && walletInfo?.caInfo[currentNetwork]?.managerInfo);
  }

  async isActive(origin: string) {
    return (await this.originIsAuthorized(origin)) && (await this.isLogged());
  }

  async accounts(origin: string) {
    const [wallet, active] = await Promise.all([this.getWallet(), this.isActive(origin)]);
    if (!active || !wallet.walletInfo?.caInfo) return {};
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

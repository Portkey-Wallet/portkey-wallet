import { addDapp } from '@portkey-wallet/store/store-ca/dapp/actions';
import { DappStoreItem } from '@portkey-wallet/store/store-ca/dapp/type';
import { DappManagerOptions, IDappManager, IDappManagerStore } from '@portkey-wallet/types/types-ca/dapp';

export class DappManager implements IDappManager {
  protected store: IDappManagerStore;
  constructor(options: DappManagerOptions) {
    this.store = options.store;
  }
  checkOriginIsAuthorized(origin: string): boolean {
    const { wallet, dapp } = this.store.getState();
    return !!dapp.dappList?.[wallet.currentNetwork]?.some(item => item.origin === origin);
  }
  addDapp(dapp: DappStoreItem) {
    const { wallet } = this.store.getState();
    this.store.dispatch(addDapp({ networkType: wallet.currentNetwork, dapp: dapp }));
  }
}

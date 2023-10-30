import { DappStoreItem } from '@portkey-wallet/store/store-ca/dapp/type';
import { GetSignatureParams, SendTransactionParams } from '@portkey/provider-types';
import ConnectOverlay from './components/ConnectOverlay';
import SignOverlay from './components/SignOverlay';
import TransactionOverlay from './components/TransactionOverlay';

export interface IDappOverlay {
  requestAccounts(dapp: DappStoreItem): Promise<boolean>;
  sendTransaction(dapp: DappStoreItem, params: SendTransactionParams): Promise<boolean>;
  wallet_getSignature(dapp: DappStoreItem, params: GetSignatureParams): Promise<boolean>;
}

export class DappOverlay implements IDappOverlay {
  async requestAccounts(dapp: DappStoreItem): Promise<boolean> {
    return new Promise(resolve => {
      ConnectOverlay.showConnectModal({
        dappInfo: dapp,
        onApprove: () => resolve(true),
        onReject: () => resolve(false),
      });
    });
  }
  async sendTransaction(dapp: DappStoreItem, params: SendTransactionParams): Promise<boolean> {
    return new Promise(resolve => {
      TransactionOverlay.showTransactionModal({
        dappInfo: dapp,
        transactionInfo: params as any,
        onSign: () => resolve(true),
        onReject: () => resolve(false),
      });
    });
  }
  async wallet_getSignature(dapp: DappStoreItem, params: GetSignatureParams): Promise<boolean> {
    return new Promise(resolve => {
      SignOverlay.showSignModal({
        dappInfo: dapp,
        signInfo: params,
        onSign: () => resolve(true),
        onReject: () => resolve(false),
      });
    });
  }
}

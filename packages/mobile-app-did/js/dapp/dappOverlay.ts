import { DappStoreItem } from '@portkey-wallet/store/store-ca/dapp/type';
import { GetSignatureParams, SendTransactionParams } from '@portkey/provider-types';
import ConnectOverlay from './components/ConnectOverlay';
import SignOverlay from './components/SignOverlay';
import TransactionOverlay from './components/TransactionOverlay';
import ApproveOverlay from './components/ApproveOverlay';
import { DeviceEventEmitter } from 'react-native';
import { GuardiansApproved } from 'pages/Guardian/types';
import { ChainId } from '@portkey-wallet/types';
import { BATCH_APPROVAL_SYMBOL } from '@portkey-wallet/constants/constants-ca/dapp';

export type ApproveInfo = {
  symbol: string;
  amount: string;
  spender: string;
  decimals: number;
  targetChainId: ChainId;
  alias?: string;
};

export type ApproveParams = {
  approveInfo: ApproveInfo;
  eventName: string;
  isDiscover?: boolean;
  /**
   * @deprecated useless
   */
  showBatchApproveToken?: boolean;
  batchApproveNFT?: boolean;
};

export async function requestManagerApprove(
  dappInfo: DappStoreItem,
  approveParams: ApproveParams,
): Promise<{ success: boolean; guardiansApproved: GuardiansApproved; approveInfo: ApproveInfo } | false> {
  return new Promise(resolve => {
    const listener = DeviceEventEmitter.addListener(approveParams.eventName, data => {
      const { success } = data || {};
      listener.remove();
      if (!success) return resolve(false);
      return resolve(data);
    });
    ApproveOverlay.showApproveModal({
      dappInfo,
      approveParams,
      onReject: () => {
        listener.remove();
        resolve(false);
      },
    });
  });
}

export interface IDappOverlay {
  requestAccounts(dapp: DappStoreItem): Promise<boolean>;
  sendTransaction(dapp: DappStoreItem, params: SendTransactionParams): Promise<boolean>;
  wallet_getSignature(dapp: DappStoreItem, params: GetSignatureParams): Promise<boolean>;
  approve(
    dapp: DappStoreItem,
    params: ApproveParams,
  ): Promise<{ success: boolean; guardiansApproved: GuardiansApproved; approveInfo: ApproveInfo } | false>;
}

export class DappOverlay implements IDappOverlay {
  async requestAccounts(dappInfo: DappStoreItem): Promise<boolean> {
    return new Promise(resolve => {
      ConnectOverlay.showConnectModal({
        dappInfo,
        onApprove: () => resolve(true),
        onReject: () => resolve(false),
      });
    });
  }
  async sendTransaction(dappInfo: DappStoreItem, params: SendTransactionParams): Promise<boolean> {
    return new Promise(resolve => {
      TransactionOverlay.showTransactionModal({
        dappInfo,
        transactionInfo: params as any,
        onSign: () => resolve(true),
        onReject: () => resolve(false),
      });
    });
  }
  async wallet_getSignature(dappInfo: DappStoreItem, signInfo: GetSignatureParams): Promise<boolean> {
    return new Promise(resolve => {
      SignOverlay.showSignModal({
        dappInfo,
        signInfo,
        onSign: () => resolve(true),
        onReject: () => resolve(false),
      });
    });
  }

  async approve(
    dappInfo: DappStoreItem,
    approveParams: ApproveParams,
  ): Promise<{ success: boolean; guardiansApproved: GuardiansApproved; approveInfo: ApproveInfo } | false> {
    return new Promise(resolve => {
      // batch approval from dapp forbidden
      if (approveParams.approveInfo.symbol === BATCH_APPROVAL_SYMBOL) return resolve(false);

      const listener = DeviceEventEmitter.addListener(approveParams.eventName, data => {
        const { success } = data || {};
        listener.remove();
        if (!success) return resolve(false);
        return resolve(data);
      });
      ApproveOverlay.showApproveModal({
        dappInfo,
        approveParams,
        onReject: () => {
          listener.remove();
          resolve(false);
        },
      });
    });
  }
}

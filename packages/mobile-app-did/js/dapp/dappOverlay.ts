import { DappStoreItem } from '@portkey-wallet/store/store-ca/dapp/type';
import { GetSignatureParams, SendTransactionParams } from '@portkey/provider-types';
import ActionSheet from 'components/ActionSheet';

export interface IDappOverlay {
  requestAccounts(dapp: DappStoreItem): Promise<boolean>;
  sendTransaction(params: SendTransactionParams): Promise<boolean>;
  wallet_getSignature(params: GetSignatureParams): Promise<boolean>;
}

export class DappOverlay implements IDappOverlay {
  async requestAccounts(dapp: DappStoreItem): Promise<boolean> {
    return new Promise(resolve => {
      // mock approve
      ActionSheet.alert({
        title: 'approve',
        message: dapp.origin,
        buttons: [
          {
            title: 'OK',
            type: 'solid',
            onPress: () => resolve(true),
          },
          {
            title: 'DENIED',
            onPress: () => resolve(false),
          },
        ],
      });
    });
  }
  async sendTransaction(params: SendTransactionParams): Promise<boolean> {
    return new Promise(resolve => {
      // mock approve
      ActionSheet.alert({
        title: 'send',
        message: JSON.stringify(params),
        buttons: [
          {
            title: 'OK',
            type: 'solid',
            onPress: () => resolve(true),
          },
          {
            title: 'DENIED',
            onPress: () => resolve(false),
          },
        ],
      });
    });
  }
  async wallet_getSignature(params: GetSignatureParams): Promise<boolean> {
    return new Promise(resolve => {
      // mock approve
      ActionSheet.alert({
        title: 'send',
        message: JSON.stringify(params),
        buttons: [
          {
            title: 'OK',
            type: 'solid',
            onPress: () => resolve(true),
          },
          {
            title: 'DENIED',
            onPress: () => resolve(false),
          },
        ],
      });
    });
  }
}

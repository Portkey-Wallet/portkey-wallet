/**
 * @remarks
 * The controller that handles the event
 * chainChanged, accountsChanged, networkChanged, disconnected, connected
 */
import { DappEvents, ResponseCode, NotificationEvents } from '@portkey/provider-types';
import { WalletState } from '@portkey-wallet/store/store-ca/wallet/type';

import { changeNetworkType, setCAInfo } from '@portkey-wallet/store/store-ca/wallet/actions';
import InternalMessage from 'messages/InternalMessage';
import { handleAccounts, handleChainIds } from '@portkey-wallet/utils/dapp';
import { addDapp, removeDapp, resetDapp, resetDappList } from '@portkey-wallet/store/store-ca/dapp/actions';
import { sleep } from '@portkey-wallet/utils';
import { getStoredState } from 'redux-persist';
import { walletPersistConfig } from 'store/Provider/config';

export interface DappEventPack<T = DappEvents, D = any> {
  eventName: T;
  data?: D;
  origin?: string;
}

export const getWalletState = async (store: any) => {
  let wallet = await getStoredState(walletPersistConfig);
  if (!wallet) wallet = store.getState().wallet;
  return wallet as WalletState;
};
export default class SWEventSubController {
  // Trigger events based on user operations to notify service workers
  public static async emit(store: any, action: string, payload: any) {
    console.log(action, payload, 'action==action');
    // Asynchronous updates lead to data exceptions when emitting
    await sleep(50);
    switch (action) {
      case changeNetworkType.toString(): {
        const { currentNetwork } = await getWalletState(store);

        InternalMessage.payload(NotificationEvents.NETWORK_CHANGED, { data: currentNetwork }).send();
        break;
      }
      case setCAInfo.toString(): {
        const wallet = await getWalletState(store);
        await InternalMessage.payload(NotificationEvents.ACCOUNTS_CHANGED, { data: handleAccounts(wallet) }).send();
        await InternalMessage.payload(NotificationEvents.CHAIN_CHANGED, { data: handleChainIds(wallet) }).send();
        break;
      }
      case removeDapp.toString(): {
        if (payload.origin) {
          await InternalMessage.payload(NotificationEvents.DISCONNECTED, {
            data: { message: 'user disconnected', code: ResponseCode.USER_DENIED },
            origin: payload.origin,
          }).send();
        }
        break;
      }
      case addDapp.toString(): {
        if (payload.dapp.origin) {
          const wallet = await getWalletState(store);
          await InternalMessage.payload(NotificationEvents.CONNECTED, {
            data: {
              chainIds: handleChainIds(wallet),
            },
            origin: payload.dapp.origin,
          }).send();
        }
        break;
      }
      case resetDapp.toString():
      case resetDappList.toString(): {
        await InternalMessage.payload(NotificationEvents.DISCONNECTED, {
          data: { message: 'user logout', code: ResponseCode.USER_DENIED, origin: '*' },
        }).send();
        break;
      }
    }
  }
}

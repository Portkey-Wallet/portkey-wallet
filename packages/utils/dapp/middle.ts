import { CACommonState } from '@portkey-wallet/types/types-ca/store';
import { changeNetworkType, setCAInfo } from '@portkey-wallet/store/store-ca/wallet/actions';
import { addDapp, removeDapp, resetDappList } from '@portkey-wallet/store/store-ca/dapp/actions';

export interface IMiddlewareAPI<T = CACommonState> {
  getState(): Promise<T>;
  dispatch: any;
}

export interface IEvent {
  emit: (action: string, payload: any) => void;
}

const ActionList = [
  /** connected */
  addDapp.toString(),
  /**
   * accountsChanged
   * chainChanged
   */
  setCAInfo.toString(),
  /** disconnected origin */
  removeDapp.toString(),
  /** disconnected all */
  resetDappList.toString(),
  /** networkChanged */
  changeNetworkType.toString(),
];

export class DappMiddle {
  public static event?: IEvent;
  public static middle = () => (next: any) => (action: { type: string; payload: any }) => {
    if (ActionList.includes(action.type)) DappMiddle.event?.emit(action.type, action.payload);
    return next(action);
  };
  public static registerEvent(event: IEvent) {
    DappMiddle.event = event;
  }
}

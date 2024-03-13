import { CACommonState } from 'packages/types/types-ca/store';
import { changeNetworkType, setCAInfo } from 'packages/store/store-ca/wallet/actions';
import { addDapp, removeDapp, resetDappList } from 'packages/store/store-ca/dapp/actions';

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

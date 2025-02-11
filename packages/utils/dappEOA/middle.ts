import { EOACommonState } from '@portkey-wallet/types/types-eoa/store';
import { setCurrentNetwork } from '@portkey-wallet/store/store-eoa/network/actions';
import { addDapp, removeDapp, resetDappList } from '@portkey-wallet/store/store-eoa/dapp/actions';

export interface IMiddlewareAPI<T = EOACommonState> {
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
  // setCAInfo.toString(),
  /** disconnected origin */
  removeDapp.toString(),
  /** disconnected all */
  resetDappList.toString(),
  /** networkChanged */
  setCurrentNetwork.toString(),
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

// Middleware<{}, RootState<Definitions, string, ReducerPath>, ThunkDispatch<any, any, AnyAction>>
import { CACommonState } from '@portkey-wallet/types/types-ca/store';
import { changeNetworkType, setCAInfo } from '@portkey-wallet/store/store-ca/wallet/actions';
import { removeDapp } from '@portkey-wallet/store/store-ca/dapp/actions';

export interface IMiddlewareAPI<T = CACommonState> {
  getState(): Promise<T>;
  dispatch: any;
}

export interface IEvent {
  emit: (action: string, payload: any) => void;
}

const ActionList = [setCAInfo.toString(), changeNetworkType.toString(), removeDapp.toString()];

export class DappMiddle {
  public static event?: IEvent;
  public static middle = () => (next: any) => (action: { type: string; payload: any }) => {
    if (ActionList.includes(action.type)) {
      DappMiddle.event?.emit(action.type, action.payload);
    }
    return next(action);
  };
  public static registerEvent(event: IEvent) {
    DappMiddle.event = event;
  }
}

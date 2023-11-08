import { ISignalr, IListen } from '@portkey/socket';
import { DefaultRampListenList } from '../constants';
import { IOrderInfo } from '.';

export type DefaultRampListenListType = typeof DefaultRampListenList;

export interface IRampSignalr<T extends DefaultRampListenListType = DefaultRampListenListType> extends ISignalr<T> {
  requestRampOrderStatus(clientId: string, orderId: string): Promise<void>;
  onRampOrderChanged(callback: (data: IOrderInfo) => void): IListen;
}

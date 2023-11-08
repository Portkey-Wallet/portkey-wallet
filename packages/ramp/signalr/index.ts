import { BaseSignalr, ISignalrOptions } from '@portkey/socket';
import { DefaultRampListenListType, IRampSignalr } from '../types/signalr';
import { DefaultRampListenList } from '../constants';
import { IOrderInfo } from '../types';

export class RampSignalr<T extends DefaultRampListenListType = DefaultRampListenListType>
  extends BaseSignalr<T>
  implements IRampSignalr<T>
{
  constructor(options?: ISignalrOptions<T>) {
    const { listenList = DefaultRampListenList as T } = options || {};
    super({ listenList });
  }

  requestRampOrderStatus(clientId: string, orderId: string): Promise<void> {
    return this.invoke('RequestRampOrderStatus', {
      TargetClientId: clientId,
      OrderId: orderId,
    });
  }

  onRampOrderChanged(callback: (data: IOrderInfo) => void): any {
    return this.listen('onRampOrderChanged' as T[keyof T], (data: { body: IOrderInfo }) => {
      callback(data.body);
    });
  }
}

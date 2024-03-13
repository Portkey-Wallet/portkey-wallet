import { sellListenList } from 'packages/constants/constants-ca/socket';
import { AchTxAddressReceivedType, RequestOrderTransferredType } from 'packages/types/types-ca/payment';
import { BaseSignalr } from '@portkey/socket';

export class SignalrSell extends BaseSignalr {
  public requestAchTxAddress(clientId: string, orderId: string) {
    console.log('invoke RequestAchTxAddress', clientId, orderId);
    this.invoke('RequestAchTxAddress', {
      TargetClientId: clientId,
      OrderId: orderId,
    });
  }

  public onAchTxAddressReceived(
    { orderId }: { clientId: string; orderId: string },
    callback: (data: AchTxAddressReceivedType | null) => void,
  ) {
    return this.listen('onAchTxAddressReceived', (data: { body: AchTxAddressReceivedType }) => {
      if (data?.body?.orderId === orderId) {
        callback(data.body);
      } else {
        callback(null);
      }
    });
  }

  public requestOrderTransferred(clientId: string, orderId: string) {
    console.log('invoke RequestOrderTransferred', clientId, orderId);
    this.invoke('RequestOrderTransferred', {
      TargetClientId: clientId,
      OrderId: orderId,
    });
  }

  public onRequestOrderTransferred(
    { orderId }: { clientId: string; orderId: string },
    callback: (data: RequestOrderTransferredType | null) => void,
  ) {
    return this.listen('onOrderTransferredReceived', (data: { body: RequestOrderTransferredType }) => {
      if (data?.body?.orderId === orderId) {
        callback(data.body);
      } else {
        callback(null);
      }
    });
  }
}

const signalrSell = new SignalrSell({
  listenList: sellListenList,
}) as BaseSignalr<typeof sellListenList> & SignalrSell;

export default signalrSell;

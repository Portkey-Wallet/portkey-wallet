import Signalr from '../index';
import { sellListenList } from '@portkey-wallet/constants/constants-ca/socket';
import { AchTxAddressReceivedType } from '@portkey-wallet/types/types-ca/payment';

export class SignalrSell extends Signalr {
  public requestAchTxAddress(clientId: string, orderId: string) {
    console.log('invoke RequestAchTxAddress', clientId, orderId);
    this.invoke('RequestAchTxAddress', {
      TargetClientId: clientId,
      OrderId: orderId,
    });
  }

  public onAchTxAddressReceived(
    { orderId }: { clientId: string; orderId: string },
    callback: (data: AchTxAddressReceivedType) => void,
  ) {
    return this.listen('onAchTxAddressReceived', (data: { body: AchTxAddressReceivedType }) => {
      console.log('onAchTxAddressReceived: data', data);
      if (data?.body?.orderId === orderId) {
        callback(data.body);
      } else {
        throw new Error('onAchTxAddressReceived error');
      }
    });
  }
}

const signalrSell = new SignalrSell({
  listenList: sellListenList,
}) as Signalr<typeof sellListenList> & SignalrSell;

export default signalrSell;

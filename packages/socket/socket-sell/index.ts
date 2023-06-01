import Signalr from '../index';
import { sellListenList } from '@portkey-wallet/constants/constants-ca/socket';
import { AchTxAddressReceivedType } from '@portkey-wallet/types/types-ca/payment';

export class SignalrSell extends Signalr {
  public requestAchTxAddress(clientId: string, orderId: string) {
    this.invoke('RequestAchTxAddress', clientId, orderId);
  }

  public onAchTxAddressReceived(
    { orderId }: { clientId: string; orderId: string },
    callback: (data: AchTxAddressReceivedType) => void,
  ) {
    return this.listen('onAchTxAddressReceived', (data: { body: AchTxAddressReceivedType }) => {
      if (data?.body?.orderId === orderId) {
        callback(data.body);
      }
    });
  }
}

const signalrSell = new SignalrSell({
  listenList: sellListenList,
}) as Signalr<typeof sellListenList> & SignalrSell;

export default signalrSell;

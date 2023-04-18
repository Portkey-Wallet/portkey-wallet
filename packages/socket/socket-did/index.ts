import Signalr from '../index';
import { CaAccountRecoverResult, CaAccountRegisterResult } from '@portkey-wallet/types/types-ca/wallet';
import { listenList } from '@portkey-wallet/constants/constants-ca/socket';

export class SignalrDid extends Signalr {
  public Ack(clientId: string, requestId: string) {
    this.invoke('Ack', clientId, requestId);
  }

  public onCaAccountRegister(
    { clientId, requestId }: { clientId: string; requestId: string },
    callback: (data: CaAccountRegisterResult) => void,
  ) {
    return this.listen('caAccountRegister', (data: CaAccountRegisterResult) => {
      if (data.requestId === requestId) {
        if (data.body.registerStatus !== 'pending') {
          this.Ack(clientId, requestId);
        }
        callback(data);
      }
    });
  }

  public onCaAccountRecover(
    { clientId, requestId }: { clientId: string; requestId: string },
    callback: (data: CaAccountRecoverResult) => void,
  ) {
    return this.listen('caAccountRecover', (data: CaAccountRecoverResult) => {
      if (data.requestId === requestId) {
        if (data.body.recoveryStatus !== 'pending') {
          this.Ack(clientId, requestId);
        }
        callback(data);
      }
    });
  }
  public onScanLoginSuccess(callback: (data: { body: string }) => void) {
    return this.listen('onScanLoginSuccess', (data: { body: string }) => {
      if (typeof data?.body === 'string') {
        callback(data);
        this.stop();
      }
    });
  }
}

const signalrDid = new SignalrDid({
  listenList,
}) as Signalr<typeof listenList> & SignalrDid;

export default signalrDid;

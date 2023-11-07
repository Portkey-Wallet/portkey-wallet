import { HubConnectionBuilder } from '@microsoft/signalr';
import { formatTokenWithOutBear } from '@portkey-wallet/api/api-did/utils';
import { sleep } from '@portkey-wallet/utils';
import { BaseSignalr } from '@portkey/socket';
import { ISignalrOptions } from '@portkey/socket/dist/commonjs/types';
import { getFCMToken } from 'utils/FCM';

type AppStatus = 'foreground' | 'background';

class SignalrFCM extends BaseSignalr {
  portkeyToken?: string;
  fcmToken?: string;

  constructor(props: ISignalrOptions<any>) {
    super(props);
  }

  public setPortkeyToken = async (portkeyToken: string) => {
    this.portkeyToken = portkeyToken;
  };

  public getFCMToken = async (refresh: boolean = false) => {
    if (!refresh && this.fcmToken) return this.fcmToken;

    const fcmToken = await getFCMToken(refresh);
    this.fcmToken = fcmToken;
  };

  public reportAppStatus = async (status: AppStatus) => {
    // reportAppStatus
    return this.signalr?.invoke('reportAppStatus');
  };

  // TODO: change ts
  public reportDeviceInfo = async (reportDeviceInfo: any) => {
    return this.signalr?.invoke('reportDeviceInfo', {});
  };

  public exitWallet = async () => {
    // exitWallet
    return this.signalr?.invoke('exitWallet');
  };

  public switchNetwork = async () => {
    // switchNetwork
    return this.signalr?.invoke('switchNetwork');
  };

  public doOpen = async ({ url, clientId }: { url: string; clientId: string }): any => {
    console.log('doOpen start1', this.portkeyToken, '----   ----', this.fcmToken);

    if (!this.portkeyToken) {
      await this.getFCMToken();
      await sleep(3000);
      return this.doOpen({ url, clientId });
    }

    console.log('doOpen start2', this.portkeyToken, '----   ----', this.fcmToken, '----   ---- ', url, clientId);

    const signalr = new HubConnectionBuilder()
      .withUrl(url, {
        accessTokenFactory: () => formatTokenWithOutBear(this.portkeyToken || ''),
      })
      .withAutomaticReconnect()
      .build();

    if (this.signalr) await this.signalr.stop();

    await signalr.start();
    await signalr.invoke('Connect', clientId);

    this.connectionId = signalr.connectionId ?? '';
    this.signalr = signalr;
    this.url = url;
    return signalr;
  };
}

const signalrFCM = new SignalrFCM({
  listenList: [],
});

export default signalrFCM;

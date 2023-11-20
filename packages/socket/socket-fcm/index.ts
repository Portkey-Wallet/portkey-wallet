import { HubConnectionBuilder } from '@microsoft/signalr';
import { formatTokenWithOutBear } from '@portkey-wallet/api/api-did/utils';
import { DeviceInfoType, AppStatusUnit } from './types';
import { sleep } from '@portkey-wallet/utils';
import { BaseSignalr } from '@portkey/socket';
import { ISignalrOptions } from '@portkey/socket/dist/commonjs/types';

class SignalrFCM extends BaseSignalr {
  portkeyToken?: string;
  fcmToken?: string;
  fcmRefreshTokenTime?: number;
  deviceId?: string;
  deviceInfo?: DeviceInfoType;
  getFCMTokenFunc?: (refresh?: boolean) => Promise<string>;

  constructor(props: ISignalrOptions<any>) {
    super(props);
  }

  public init = ({
    deviceId,
    deviceInfo,
    getFCMTokenFunc,
  }: {
    deviceId: string;
    deviceInfo: DeviceInfoType;
    getFCMTokenFunc: (refresh?: boolean) => Promise<string>;
  }) => {
    this.deviceId = deviceId;
    this.deviceInfo = deviceInfo;
    this.getFCMTokenFunc = getFCMTokenFunc;
  };

  public setPortkeyToken = async (portkeyToken: string) => {
    this.portkeyToken = portkeyToken;
  };

  public getFCMToken = async (refresh: boolean = false) => {
    if (!refresh && this.fcmToken) return this.fcmToken;
    if (!this.getFCMTokenFunc) throw Error('Please init SignalrFCM ');

    const fcmToken = await this.getFCMTokenFunc(refresh);
    console.log('fcmToken', fcmToken);
    this.fcmToken = fcmToken;
    this.fcmRefreshTokenTime = Date.now();
  };

  public reportAppStatus = async (status: AppStatusUnit) => {
    console.log('reportAppStatus', { status, unReadCount: 99 });
    return this.signalr?.invoke('reportAppStatus', { status: 0, unReadCount: 99 });
  };

  // TODO: change ts
  public reportDeviceInfo = () => {
    console.log('deviceInfo', this.deviceInfo);
    // return this.signalr?.invoke('reportDeviceInfo', this.deviceInfo);

    const data = {
      deviceId: this.deviceId || '',
      token: this.fcmToken || '',
      refreshTime: this.fcmRefreshTokenTime || Date.now(),
      deviceInfo: this.deviceInfo,
    };

    console.log('deviceInfo  data', data);

    return this.signalr?.invoke('reportDeviceInfo', data);
  };

  private resetSignalrFCM = () => {
    this.fcmToken = undefined;
    this.fcmRefreshTokenTime = undefined;
  };

  public exitWallet = () => {
    this.signalr?.invoke('exitWallet');
    this.signalr?.stop();
    this.resetSignalrFCM();
  };

  public switchNetwork = () => {
    this.signalr?.invoke('switchNetwork');
    this.signalr?.stop();
    this.resetSignalrFCM();
  };
  public getRefreshTime = () => {
    console.log(this.fcmRefreshTokenTime);
  };

  public doOpen = async ({ url, clientId }: { url: string; clientId: string }): Promise<any> => {
    if (!this.portkeyToken) {
      await sleep(3000);
      return this.doOpen({ url, clientId });
    }

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

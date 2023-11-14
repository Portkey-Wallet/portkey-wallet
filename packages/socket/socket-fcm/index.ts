import { HubConnectionBuilder } from '@microsoft/signalr';
import { formatTokenWithOutBear } from '@portkey-wallet/api/api-did/utils';
import { sleep } from '@portkey-wallet/utils';
import { BaseSignalr } from '@portkey/socket';
import { ISignalrOptions } from '@portkey/socket/dist/commonjs/types';
type AppStatus = 'foreground' | 'background';

type DeviceInfoType = {
  deviceType?: string;
  deviceBrand?: string;
  operatingSystemVersion?: string;
};
class SignalrFCM extends BaseSignalr {
  portkeyToken?: string;
  fcmToken?: string;
  fcmRefreshTokenTime?: string;
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
    this.fcmToken = fcmToken;
    if (refresh || !fcmToken) this.fcmRefreshTokenTime = String(Date.now());
  };

  public reportAppStatus = async (status: AppStatus) => {
    return this.signalr?.invoke('reportAppStatus', status);
  };

  // TODO: change ts
  public reportDeviceInfo = (reportDeviceInfo: any) => {
    return this.signalr?.invoke('reportDeviceInfo', reportDeviceInfo);
  };

  private resetSignalrFCM = () => {
    this.fcmToken = undefined;
    this.fcmRefreshTokenTime = undefined;
  };

  public exitWallet = () => {
    this.signalr?.invoke('exitWallet');
    this.resetSignalrFCM();
    this.signalr?.stop();
  };

  public switchNetwork = () => {
    this.signalr?.invoke('switchNetwork');
    this.resetSignalrFCM();
    this.signalr?.stop();
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

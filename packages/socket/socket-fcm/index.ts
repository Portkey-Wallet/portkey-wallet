import { HubConnectionBuilder, HubConnection } from '@microsoft/signalr';
import { formatTokenWithOutBear } from '@portkey-wallet/api/api-did/utils';
import { DeviceInfoType, AppStatusUnit } from './types';
import { sleep } from '@portkey-wallet/utils';
import { BaseSignalr } from '@portkey/socket';
import { ISignalrOptions } from '@portkey/socket/dist/commonjs/types';
import { request } from '@portkey-wallet/api/api-did';
class SignalrFCM extends BaseSignalr {
  portkeyToken?: string;
  fcmToken?: string;
  fcmRefreshTokenTime?: number;
  deviceId?: string;
  deviceInfo?: DeviceInfoType;
  getFCMTokenFunc?: (refresh?: boolean) => Promise<string>;
  public openStateMap: { [key: string]: boolean };
  public locked?: boolean;
  constructor(props: ISignalrOptions<any>) {
    super(props);
    this.openStateMap = {};
  }

  public init = async ({
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
    if (!this.getFCMTokenFunc) throw Error('Please add getFCMTokenFunc ');

    const fcmToken = await this.getFCMTokenFunc(refresh);
    console.log('fcmToken', fcmToken);
    this.fcmToken = fcmToken;
    this.fcmRefreshTokenTime = Date.now();
    return fcmToken;
  };

  public reportAppStatus = async (status: AppStatusUnit, unReadCount: number) => {
    const url = request.defaultConfig.baseURL || '';
    if (!this.openStateMap[url]) await this.doOpen({ url });

    await sleep(1000);
    return this.signalr?.invoke('reportAppStatus', { status, unReadCount });
  };

  public reportDeviceInfo = () => {
    console.log('deviceInfo', this.deviceInfo);
    if (!this.deviceInfo) return;

    const data = {
      deviceId: this.deviceId || '',
      token: this.fcmToken || '',
      refreshTime: this.fcmRefreshTokenTime || Date.now(),
      deviceInfo: this.deviceInfo,
    };

    return this.signalr?.invoke('reportDeviceInfo', data);
  };

  private resetSignalrFCM = () => {
    this.fcmToken = undefined;
    this.fcmRefreshTokenTime = undefined;
  };

  public exitWallet = () => {
    try {
      this.signalr?.invoke('exitWallet');
      this.signalr?.stop();
      this.resetSignalrFCM();
    } catch (error) {
      console.log('exitWallet error', error);
    }
  };

  public switchNetwork = () => {
    try {
      this.signalr?.invoke('switchNetwork');
      this.signalr?.stop();
      this.resetSignalrFCM();
    } catch (error) {
      console.log('switchNetwork error', error);
    }
  };
  public getRefreshTime = () => {
    console.log(this.fcmRefreshTokenTime);
  };

  public doOpen = async ({ url, clientId }: { url: string; clientId?: string }): Promise<HubConnection> => {
    if (!url) throw Error('Please add url');
    if (this.locked) throw Error('locked');
    this.locked = true;
    try {
      if (!this.fcmToken) {
        await sleep(3000);
        await this.getFCMToken();
        return this.doOpen({ url: `${url}`, clientId: clientId || this.deviceId || '' });
      }

      if (!this.portkeyToken) {
        await sleep(3000);
        return this.doOpen({ url: `${url}`, clientId: clientId || this.deviceId || '' });
      }

      const signalr = new HubConnectionBuilder()
        .withUrl(`${url}/dataReporting`, {
          accessTokenFactory: () => formatTokenWithOutBear(this.portkeyToken || ''),
        })
        .withAutomaticReconnect()
        .build();

      if (this.signalr) await this.signalr.stop();

      await signalr.start();
      await signalr.invoke('Connect', clientId || this.deviceId || '');
      signalr.onreconnected(connectionId => this.onReconnected(signalr, connectionId));
      this.connectionId = signalr.connectionId ?? '';
      this.signalr = signalr;
      this.url = url;

      await this.reportDeviceInfo();
      this.openStateMap = { [url]: true };
      return signalr;
    } catch (error) {
      throw error;
    } finally {
      this.locked = false;
    }
  };

  async onReconnected(signalr: HubConnection, _connectionId?: string) {
    try {
      signalr.invoke('Connect', this.deviceId || '');
    } catch (error) {
      console.log('onReconnected error', error);
    }
  }
}

const signalrFCM = new SignalrFCM({
  listenList: [],
});

export default signalrFCM;

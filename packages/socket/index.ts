import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { randomId } from '@portkey-wallet/utils';
import { Receive, SocketError } from './types';

export interface ISignalrOption<ListenList> {
  listenList: ListenList;
}

interface IMessageMap {
  [eventName: string]: {
    [key: string]: (data?: any) => void;
  };
}

export default class Signalr<ListenList = any> {
  url?: string;
  signalr: HubConnection | null;
  connectionId: string;
  private messageMap: IMessageMap;
  private listenList: ListenList;
  constructor({ listenList }: ISignalrOption<ListenList>) {
    this.connectionId = '';
    this.messageMap = {};
    this.signalr = null;
    this.listenList = listenList;
  }

  doOpen = async ({ url, clientId }: { url: string; clientId: string }) => {
    const signalr = new HubConnectionBuilder().withUrl(url).withAutomaticReconnect().build();
    this._listener(signalr);
    if (this.signalr) await this.signalr.stop();
    await signalr.start();
    await signalr.invoke('Connect', clientId);
    this.connectionId = signalr.connectionId ?? '';
    this.signalr = signalr;
    this.url = url;
    return signalr;
  };

  public listen = (name: ListenList[keyof ListenList], handler: (data?: any) => void) => {
    const key = randomId();
    let _name = name as string;
    if (!this.messageMap[_name]) this.messageMap[_name] = {};
    this.messageMap[_name][key] = handler;
    return {
      remove: () => {
        delete this.messageMap[_name][key];
      },
    };
  };

  public on: HubConnection['on'] = (...args) => {
    return this._checkSignalr().on(...args);
  };

  public invoke: HubConnection['invoke'] = (...args) => {
    return this._checkSignalr().invoke(...args);
  };

  public onClose: HubConnection['onclose'] = (...args) => {
    return this._checkSignalr().onclose(...args);
  };

  public stop: HubConnection['stop'] = (...args) => {
    return this._checkSignalr().stop(...args);
  };

  public destroy: HubConnection['stop'] = () => {
    this.messageMap = {};
    return this._checkSignalr().stop();
  };

  private _listener(signalr: HubConnection) {
    (this.listenList as string[]).forEach(listenType => {
      signalr.on(listenType, (data: any) => {
        this._onReceiver({ Event: listenType, Data: data });
      });
    });
  }

  private _onReceiver(data: Receive): void {
    const callback = this.messageMap[data.Event];
    callback &&
      Object.values(callback).forEach(handler => {
        handler(data.Data);
      });
  }

  private _checkSignalr() {
    if (!this.signalr) throw SocketError.notConnect;
    return this.signalr;
  }
}

export interface Receive {
  Event: string;
  Data?: any;
}

export enum SocketError {
  notConnect = 'Signalr is null, please doOpen',
}

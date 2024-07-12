export interface BaseContext {
  clientId: string;
  requestId: string;
}

export interface IContext {
  context: BaseContext;
}

export enum PlatFormInHeader {
  ANDROID = 'android',
  IOS = 'ios',
  EXTENSION = 'extension',
}

export interface BaseContext {
  clientId: string;
  requestId: string;
}

export interface IContext {
  context: BaseContext;
}

export enum PlatFormInHeader {
  APP = 'app',
  EXTENSION = 'extension',
}

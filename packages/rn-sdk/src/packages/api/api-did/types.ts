export interface BaseContext {
  clientId: string;
  requestId: string;
}

export interface IContext {
  context: BaseContext;
}

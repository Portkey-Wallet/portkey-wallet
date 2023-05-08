export enum EthereumEvents {
  CONNECTED = 'connected',
  MESSAGE = 'message',
  DISCONNECTED = 'disconnected',
  ACCOUNT_CHANGED = 'accountChanged',
  CHAIN_CHANGED = 'chainChanged',
  ERROR = 'error',
  HELLO_PORTKEY = 'hello_portkey',
}

export enum RequestCode {
  ERROR_IN_PARAMS = -1,
  UNKNOWN_METHOD = -2,
  SUCCESS = 0,
  INTERNAL_ERROR = 1,
  TIMEOUT = 2,
}

export enum EthereumEventsDeprecated {
  CLOSE = 'close',
  CHAIN_ID_CHANGED = 'chainIdChanged',
  NETWORK_CHANGED = 'networkChanged',
  NOTIFICATION = 'notification',
}

export interface RequestMessage {
  payload: { method: string; msg: string };
  eventId: string;
}

export interface RequestResponse {
  code: RequestCode;
  msg?: string;
  data?: any;
}

export interface EthereumBehaviour {
  isConnected: () => boolean;
  on(event: EthereumEvents | EthereumEventsDeprecated, listener: (...args: any[]) => void): this;
  once(event: EthereumEvents | EthereumEventsDeprecated, listener: (...args: any[]) => void): this;
  addListener(event: EthereumEvents | EthereumEventsDeprecated, listener: (...args: any[]) => void): this;
  removeListener(event: EthereumEvents | EthereumEventsDeprecated, listener: (...args: any[]) => void): this;
  request: (payload: any) => Promise<any>;
}

export interface EthereumBehaviourDeprecated {
  chainId: string;
  networkVersion: string;
  selectedAddress: string;
}

export interface EthereumBehaviourAlias {
  // Use request({ method: 'eth_requestAccounts' }) instead of enable()
  enable: () => void;
  // It is recoomended to use request() instead of send() or sendAsync()
  send: (payload: any, callback: (error: Error, response: any) => void) => Promise<any>;
  sendAsync: (payload: any, callback: (error: Error, response: any) => void) => Promise<any>;
}

export default interface DappOperationHandler
  extends EthereumBehaviour,
    Partial<EthereumBehaviourDeprecated>,
    Partial<EthereumBehaviourAlias> {
  isPortkey: boolean;
}

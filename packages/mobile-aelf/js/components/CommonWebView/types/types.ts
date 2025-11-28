export enum BridgeActionTypes {
  'CONNECT' = 'connect',
  'DISCONNECT' = 'disconnect',
  'API' = 'api',
  'INVOKE' = 'invoke',
  'INVOKEREAD' = 'invokeRead',
  'GETCONTRACTMETHODS' = 'getContractMethods',
  'ACCOUNT' = 'account',
}

export interface ParamsOfRequestTypes {
  originalParams?: string;
  signature: string;
  encryptAlgorithm?: string;
  publicKey?: string;
  timestamp?: number;
}

export interface WebViewRequestTypes {
  appId: string;
  action: BridgeActionTypes;
  id: string;
  params: ParamsOfRequestTypes;
}

export interface ConnectionResponseResultType {
  random: string;
  publicKey: string;
  signature: string;
}

export interface RnResponseTypes {
  id: string;
  result: {
    code: number;
    msg: string;
    err: [];
    data: ConnectionResponseResultType;
  };
}

interface DappRequestWrapper {
  eventId: string;
  params: DappRequestArguments;
}

interface DappRequestArguments {
  method: RPCMethods;
  payload?: any;
}

interface DappRequestResponse {
  code: ResponseCode;
  data?: any;
  msg?: string;
}

enum ResponseCode {
  ERROR_IN_PARAMS = -1,
  UNKNOWN_METHOD = -2,
  UNIMPLEMENTED = -3,
  UNAUTHENTICATED = -4,
  SUCCESS = 0,
  INTERNAL_ERROR = 1,
  TIMEOUT = 2,
  USER_DENIED = 3,
}

enum RPCMethodsBase {
  ACCOUNTS = 'aelf_accounts',
  REQUEST_ACCOUNTS = 'aelf_requestAccounts',
  DECRYPT = 'aelf_decrypt',
  CHAIN_ID = 'aelf_chainId',
  GET_PUBLIC_KEY = 'aelf_getEncryptionPublicKey',
}

enum RPCMethodsUnimplemented {
  ADD_CHAIN = 'wallet_addEthereumChain',
  SWITCH_CHAIN = 'wallet_switchEthereumChain',
  REQUEST_PERMISSIONS = 'wallet_requestPermissions',
  GET_PERMISSIONS = 'wallet_getPermissions',
  NET_VERSION = 'net_version',
}

type RPCMethods = RPCMethodsBase | RPCMethodsUnimplemented;

export {
  DappRequestArguments,
  DappRequestWrapper,
  DappRequestResponse,
  ResponseCode,
  RPCMethods,
  RPCMethodsBase,
  RPCMethodsUnimplemented,
};

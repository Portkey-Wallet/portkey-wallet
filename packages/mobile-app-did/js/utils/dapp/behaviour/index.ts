import { TransactionInfo } from './transaction';

export enum CentralEthereumEvents {
  CONNECTED = 'connected',
  MESSAGE = 'message',
  DISCONNECTED = 'disconnected',
  ACCOUNT_CHANGED = 'accountChanged',
  CHAIN_CHANGED = 'chainChanged',
  ERROR = 'error',
}

export enum EthereumEventsDeprecated {
  // Use EthereumEvents.DISCONNECTED instead
  CLOSE = 'close',
  // Use EthereumEvents.ACCOUNT_CHANGED instead
  CHAIN_ID_CHANGED = 'chainIdChanged',
  NETWORK_CHANGED = 'networkChanged',
  // UseEthereumEvents.ACCOUNT_CHANGED instead
  NOTIFICATION = 'notification',
}

export type EthereumEvents = CentralEthereumEvents | EthereumEventsDeprecated;

export interface RequestMessage {
  payload: { method: RPCMethods; data: any };
  eventId: string;
}

export interface RequestResponse {
  code: RequestCode;
  msg?: string;
  data?: any;
}

export enum RequestCode {
  ERROR_IN_PARAMS = -1,
  UNKNOWN_METHOD = -2,
  UNIMPLEMENTED = -3,
  SUCCESS = 0,
  INTERNAL_ERROR = 1,
  TIMEOUT = 2,
}

export interface EthereumBehaviour {
  isConnected: () => boolean;
  on(event: EthereumEvents, listener: (...args: any[]) => void): this;
  once(event: EthereumEvents, listener: (...args: any[]) => void): this;
  addListener(event: EthereumEvents, listener: (...args: any[]) => void): this;
  removeListener(event: EthereumEvents, listener: (...args: any[]) => void): this;
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

export interface Auth {
  name: string;
  avatar?: string;
  website?: string;
}

export enum WalletPermissions {
  ACCOUNTS = 'eth_accounts',
}

export enum RPCMethodsBase {
  ACCOUNTS = 'eth_accounts',
  REQUEST_ACCOUNTS = 'eth_requestAccounts',
  DECRYPT = 'eth_decrypt',
  GET_PUBLIC_KEY = 'eth_getEncryptionPublicKey',
}

export enum RPCMethodsUnimplemented {
  ADD_CHAIN = 'wallet_addEthereumChain',
  SWITCH_CHAIN = 'wallet_switchEthereumChain',
  REQUEST_PERMISSIONS = 'wallet_requestPermissions',
  GET_PERMISSIONS = 'wallet_getPermissions',
  NET_VERSION = 'net_version',
}

export enum RPCMethodsDemo {
  HELLO_PORTKEY = 'hello_portkey',
}

export type RPCMethods = RPCMethodsBase | RPCMethodsUnimplemented | RPCMethodsDemo;

interface Web3OperationAdapterBase {
  /**
   * get the current chain id
   * @returns chainId
   */
  getChainId: () => Promise<{ chainId: string }>;

  /**
   * get current account address
   * remember that if a dapp doesn't have the permission to get the account address, it will return nothing or meaningless value
   * @returns accountChainId
   */
  getAccountAddress: () => Promise<{ accountChainId?: string }>;

  /**
   * use this API to connect to the current wallet provider
   * @returns isSuccess marks whether the connection is success or not
   * @returns accountChainId provides wallet chainId, if the connection is not working, it will be empty
   * @info accountChainId is an array, because some wallet providers support multiple chainId
   */
  connectWallet: () => Promise<{ isSuccess: boolean; accountChainId: Array<string> }>;

  /**
   * decrypt message that encrypted by the account public key
   * @param params message is the encrypted message, account is the account address
   * @returns decryptedMessage
   */
  decryptMessage: (params: { message: string; account: string }) => Promise<{ decryptedMessage: string }>;

  /**
   * give the public key of particular account address
   * @param params account: the account address
   * @returns publicKey
   * @info if the caller don't have the permission to get the public key, it will return empty (WalletPermissions.ACCOUNTS)
   */
  getAccountPublicKey: (params: { account: string }) => Promise<{ publicKey: string }>;

  /**
   * process a transaction and ask user to deal with
   * @param params TransactionInfo
   * @returns isSuccess: whether the transaction is success or not, txHash: the transaction hash
   */
  processTransaction: (params: TransactionInfo) => Promise<{ isSuccess: boolean; txHash: string }>;
}

interface Web3OperationAdapterExperimental {
  /**
   * grant permissions that a website may use
   * since eth_accounts is the only permission that a website can get, this API is not implemented yet
   * @param premissions the permission that a website want to get
   * @returns grantedPermissions show granted permissions
   */
  requestPermissions: (
    premissions: Array<WalletPermissions>,
  ) => Promise<{ grantedPermissions: Array<WalletPermissions> }>;

  /**
   * returns the permissions that a website has been granted
   * @returns grantedPermissions show granted permissions
   */
  getPermissions: () => Promise<{ grantedPermissions: Array<WalletPermissions> }>;
}

export type Web3OperationAdapter = Web3OperationAdapterBase &
  Partial<Web3OperationAdapterExperimental> &
  Partial<EthereumBehaviourAlias>;

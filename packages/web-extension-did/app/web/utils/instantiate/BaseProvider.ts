import { ConsoleLike } from '@portkey-wallet/types';
import { BaseChainType } from '@portkey-wallet/types/chain';
import EncryptedStream from 'utils/EncryptedStream';
import errorHandler from 'utils/errorHandler';
import IdGenerator from 'utils/IdGenerator';
import PortKeyListener from './PortKeyListener';
import * as PageContentTags from 'messages/PageContentTags';

/**
 * This is the javascript which gets injected into
 * the application and facilitates communication between
 * Portkey and the web application.
 */
let promisePendingList: any[] = [];

export interface BaseProviderOptions {
  /**
   * The logging API to use.
   */
  logger?: ConsoleLike;

  /**
   * The maximum number of event listeners.
   */
  maxEventListeners?: number;
}

export interface BaseProviderState {
  accounts: null | string[];
  isConnected: boolean;
  isUnlocked: boolean;
  initialized: boolean;
  isPermanentlyDisconnected: boolean;
}

export default class BaseProvider extends PortKeyListener {
  protected _state: BaseProviderState;
  protected readonly _log: ConsoleLike;
  public AElf: any;
  public CrossChain: any;

  protected static _defaultState: BaseProviderState = {
    accounts: null,
    isConnected: false,
    isUnlocked: false,
    initialized: false,
    isPermanentlyDisconnected: false,
  };

  constructor({ logger = console, maxEventListeners = 100 }: BaseProviderOptions) {
    super({ logger, maxEventListeners });
    this._state = {
      ...BaseProvider._defaultState,
    };
    this.setMaxListeners(maxEventListeners);
    this._log = logger;
    this._handleAccountsChanged = this._handleAccountsChanged.bind(this);
    this._handleConnect = this._handleConnect.bind(this);
    this._handleChainChanged = this._handleChainChanged.bind(this);
    this._handleDisconnect = this._handleDisconnect.bind(this);
    this._handleUnlockStateChanged = this._handleUnlockStateChanged.bind(this);
    this._handlePendingPromise = this._handlePendingPromise.bind(this);
  }

  /**
   * @param data currentChain info
   */
  protected _handleChainChanged(data: BaseChainType) {
    console.log(data, '_handleChainChanged==');
    this._handleConnect(data);
    this.emit('chainChanged', data);
  }

  /**
   * @param data currentChain info
   */
  protected _handleConnect(data: BaseChainType) {
    console.log('_handleConnect', this._state.isConnected);
    if (!this._state.isConnected) {
      this._state.isConnected = true;
      this.emit('connect', data);
    }
  }

  /**
   * @param data currentChain info
   */
  protected _handleDisconnect(data: any) {
    this._state.isConnected = false;
    this.emit('onDisconnect', data);
  }

  protected _handleUnlockStateChanged({ isLocked }: { isLocked: boolean }) {
    this.emit('lockStateChanged', { isLocked });
    if (isLocked) {
      this.emit('lock');
    } else {
      this.emit('unlock');
    }
  }

  /** */
  protected _handleAccountsChanged(data: { accountName: string; address: string }) {
    this.emit('accountsChanged', data);
  }

  protected _request(stream: EncryptedStream, args: RequestArguments): Promise<any> {
    if (!args || typeof args !== 'object' || Array.isArray(args)) {
      throw errorHandler(410005, {
        data: args,
      });
    }
    const { method, params } = args;
    if (typeof method !== 'string' || method.length === 0) {
      throw errorHandler(410006, {
        data: args,
      });
    }

    if (params !== undefined && !Array.isArray(params) && (typeof params !== 'object' || params === null)) {
      throw errorHandler(410007, {
        data: args,
      });
    }

    // if (!this.stream) throw errorHandler(200015);

    return new Promise((resolve, reject) => {
      const data = Object.assign({}, args, {
        sid: IdGenerator.numeric(24),
      });
      promisePendingList.push({
        sid: data.sid,
        resolve,
        reject,
      });
      stream?.send(data, PageContentTags.CONTENT_PORTKEY);
    });
  }

  protected _handlePendingPromise(eventMessage: any) {
    if (eventMessage) {
      const sid = eventMessage.sid;
      promisePendingList = promisePendingList.filter((item) => {
        if (item.sid === sid) {
          item.resolve(eventMessage);
          return false;
        }
        return true;
      });
    }
  }

  isConnected() {
    return this._state.isConnected;
  }
}

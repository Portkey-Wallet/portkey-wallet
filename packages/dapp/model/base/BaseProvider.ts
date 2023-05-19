import { EventEmitter } from 'events';
import ProviderInterface from './Provider';
import { DappEvents, EventId, EventResponse } from './Event';
import {
  DappRequestArguments,
  DappRequestResponse,
  ResponseCode,
  RPCMethods,
  RPCMethodsBase,
  RPCMethodsUnimplemented,
} from './Request';
import DappInteractionStream from './DappStream';

/**
 * BaseProvider
 * @description BaseProvider is the base class for all providers.
 * This object will be injected into the dapp page as window.aelf or someting else
 * @example
 * ```
 * class MyProvider extends BaseProvider {
 *  ...
 * }
 * window.aelf=new MyProvider();
 * ```
 */
export default abstract class BaseProvider extends EventEmitter implements ProviderInterface {
  private companionStream: DappInteractionStream;

  constructor(stream: DappInteractionStream) {
    super();
    this.companionStream = stream;
  }

  /**
   * @override
   * creates a listener on the provider
   * @param {DappEvents} eventName event name that the listener will listen to
   * @param {Function} listener callback function
   */
  public on(event: DappEvents, listener: (...args: any[]) => void): this {
    super.on(event, listener);
    return this;
  }

  /**
   * @override
   * creates a listener on the provider, the listener will be removed after the first time it is triggered
   * @param {DappEvents} eventName event name that the listener will listen to
   * @param {Function} listener callback function
   */
  public once(event: DappEvents | EventId, listener: (...args: any[]) => void): this {
    super.once(event, listener);
    return this;
  }

  /**
   * @override
   * alias for ```BaseProvider.on()```
   * @param {DappEvents} eventName event name that the listener will listen to
   * @param {Function} listener callback function
   */
  public addListener(eventName: DappEvents, listener: (...args: any[]) => void): this {
    return this.on(eventName, listener);
  }

  /**
   * remove a listener from the provider
   * @param eventName  event name that the listener used to listen to
   * @param {Function} listener callback function
   */
  public removeListener(eventName: string | symbol, listener: (...args: any[]) => void): this {
    super.removeListener(eventName, listener);
    return this;
  }

  /**
   * emit method to create a event on the provider
   * @param event ```DappEvents | EventId``` event name or eventId
   * @param response ```DappRequestResponse | EventResponse``` response data
   */
  public emit(event: DappEvents | EventId, response: DappRequestResponse | EventResponse): boolean {
    return super.emit(event, response);
  }

  public request = async (params: DappRequestArguments): Promise<DappRequestResponse> => {
    const eventId = this.getEventId();
    const { method } = params || {};
    if (!this.methodCheck(method)) {
      return { code: ResponseCode.ERROR_IN_PARAMS, msg: 'method not found!' };
    }
    this.companionStream.push({ eventId, params });
    return new Promise((resolve, reject) => {
      this.once(eventId, (response: DappRequestResponse) => {
        if (response.code === ResponseCode.SUCCESS) {
          resolve(response);
        } else {
          reject(response);
        }
      });
    });
  };

  protected methodCheck = (method: string): method is RPCMethods => {
    return method in RPCMethodsBase || method in RPCMethodsUnimplemented;
  };

  setupStream = (companionStream: DappInteractionStream) => {
    this.companionStream = companionStream;
  };

  onConnectionDisconnect = (error: Error) => {
    console.warn('connection disconnected, please re-open this webpage!', error);
  };

  /**
   * create an unduplicated eventId for a request
   * @param {number} seed used to generate random number, default is 999999
   * @returns {string} eventId
   */
  protected getEventId = (seed: number = 999999): string => {
    return new Date().getTime() + '_' + Math.floor(Math.random() * seed);
  };
}

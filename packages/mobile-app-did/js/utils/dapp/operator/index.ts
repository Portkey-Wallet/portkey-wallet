import WebView, { WebViewMessageEvent } from 'react-native-webview';
import {
  CentralEthereumEvents,
  EthereumEventsDeprecated,
  RequestCode,
  RequestMessage,
  RequestResponse,
  RPCMethods,
  RPCMethodsDemo,
  RPCMethodsUnimplemented,
} from '../behaviour';
import handlerJS from '../webpageHandler';
import DappOperationManager from '../manager';

export default class DappOperator {
  private static ins: DappOperator = new DappOperator();
  private webviewRef?: WebView | null;

  public static getIns(): DappOperator {
    return DappOperator.ins;
  }

  public init(webviewRef: WebView): void {
    this.webviewRef = webviewRef;
    this.injectHandlerToWebview();
  }

  private constructor(webviewRef?: WebView) {
    this.webviewRef = webviewRef;
  }

  private injectHandlerToWebview = (): void => {
    this.executeJS(handlerJS);
  };

  public handleDappMessage = async ({ nativeEvent }: WebViewMessageEvent) => {
    const { data } = nativeEvent;
    console.log(decodeURIComponent(data), 'handleDappMessage');
    try {
      const {
        payload: { method, data: requestData },
        eventId,
      } = (JSON.parse(decodeURIComponent(data)) as RequestMessage) || {};
      console.log(`method: ${method}, data: ${requestData}`);
      await this.handleRequest(method, requestData, eventId);
    } catch (e) {
      console.error('error when try to parse object:', data);
    }
  };

  public publishPresetEvent = (event: CentralEthereumEvents, data: RequestResponse): void => {
    this.eventSideEffect(event, data);
    this.emitEventToWebview(event, data);
  };

  public publishEventCallback = (eventId: string, data: RequestResponse): void => {
    this.executeJS(`window.ethereum?.emit('${eventId}', ${data ? JSON.stringify(data) : '{}'})`);
  };

  // for user that uses deprecated event name
  public eventSideEffect = (event: CentralEthereumEvents, data: RequestResponse): void => {
    switch (event) {
      case CentralEthereumEvents.CONNECTED:
        this.emitEventToWebview(EthereumEventsDeprecated.NETWORK_CHANGED, data);
        break;
      case CentralEthereumEvents.CHAIN_CHANGED:
        this.emitEventToWebview(EthereumEventsDeprecated.CHAIN_ID_CHANGED, data);
        this.emitEventToWebview(EthereumEventsDeprecated.NETWORK_CHANGED, data);
        break;
      case CentralEthereumEvents.DISCONNECTED:
        this.emitEventToWebview(EthereumEventsDeprecated.CLOSE, data);
        break;
      default:
        break;
    }
  };

  public emitEventToWebview = (
    event: CentralEthereumEvents | EthereumEventsDeprecated,
    data: RequestResponse,
  ): void => {
    this.executeJS(`window.ethereum?.emit('${event}', ${data ? JSON.stringify(data) : '{}'})`);
  };

  protected handleRequest = async (method: RPCMethods, data: any, eventId: string) => {
    try {
      switch (method) {
        case RPCMethodsDemo.HELLO_PORTKEY: {
          this.publishEventCallback(eventId, await DappOperationManager.handleGreetings());
          break;
        }
        case RPCMethodsUnimplemented.ADD_CHAIN:
        case RPCMethodsUnimplemented.SWITCH_CHAIN:
        case RPCMethodsUnimplemented.REQUEST_PERMISSIONS:
        case RPCMethodsUnimplemented.GET_PERMISSIONS:
        case RPCMethodsUnimplemented.NET_VERSION: {
          await this.publishEventCallback(eventId, {
            code: RequestCode.UNIMPLEMENTED,
            msg: 'this method is not implemented',
          });
          break;
        }
        default:
      }
    } catch (e) {
      console.error(`error when handleRequest: ${method}, ${data}, ${eventId}`);
      await this.publishEventCallback(eventId, {
        code: RequestCode.INTERNAL_ERROR,
        msg: 'internal error',
      });
    }
  };

  private executeJS = (js: string): void => {
    if (!this.webviewRef) {
      console.error("there's no webviewRef");
      return;
    }
    this.webviewRef.injectJavaScript(js);
  };
}

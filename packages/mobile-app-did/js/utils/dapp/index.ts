import WebView, { WebViewMessageEvent } from 'react-native-webview';
import { EthereumEvents, EthereumEventsDeprecated, RequestCode, RequestMessage, RequestResponse } from './behaviour';

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
    this.executeJS(`
    const maxWaitTime = 5000;
    const createHandler=()=>{
      return {
        isPortkey: true,
        on: (event, listener) => {
          window.addEventListener(event, listener);
        },
        once: (event, listener) => {
          window.addEventListener(event, listener, { once: true });
        },
        addListener: (event, listener) => {
          window.addEventListener(event, listener);
        },
        removeListener: (event, listener) => {
          window.removeEventListener(event, listener);
        },
        request: async (payload) => {
          const eventId=randomId();
          window.ReactNativeWebView.postMessage(JSON.stringify({payload,eventId}));
          return new Promise((resolve, reject) => {
            setTimeout(()=>{reject({code:-1,msg:'timeout'})},maxWaitTime);
            window.addEventListener(eventId,(e)=>{
              const {msg,code}=e.detail || {};
              if(code===0){
                resolve(e.detail);
                return;
              }
              reject(e.detail);
            },{once:true});
          });
        },
        emit: (event, data) => {
          window.dispatchEvent(new CustomEvent(event,{detail:data}));
        },
      };
    }
    const randomId = (max=999999) => new Date().getTime()+'_'+Math.floor(Math.random() * max);
    window.ethereum = createHandler();
    `);
  };

  public handleDappMessage = async ({ nativeEvent }: WebViewMessageEvent) => {
    const { data } = nativeEvent;
    console.log(decodeURIComponent(data), 'handleDappMessage');
    try {
      const {
        payload: { method, msg },
        eventId,
      } = (JSON.parse(decodeURIComponent(data)) as RequestMessage) || {};
      console.log(`method: ${method}, msg: ${msg}`);
      if (method === EthereumEvents.HELLO_PORTKEY) {
        this.publishEventCallback(eventId, { msg: 'greetings', code: 0 });
      } else {
        this.publishEventCallback(eventId, { code: RequestCode.UNKNOWN_METHOD, msg: 'unknown method!' });
      }
    } catch (e) {
      console.error('error when try to parse object:', data);
    }
  };

  public publishPresetEvent = (event: EthereumEvents, data: RequestResponse): void => {
    this.eventSideEffect(event, data);
    this.emitEventToWebview(event, data);
  };

  public publishEventCallback = (event: string, data: RequestResponse): void => {
    this.executeJS(`window.ethereum?.emit('${event}', ${data ? JSON.stringify(data) : '{}'})`);
  };

  // for user that uses deprecated event name
  public eventSideEffect = (event: EthereumEvents, data: RequestResponse): void => {
    switch (event) {
      case EthereumEvents.CONNECTED:
        this.emitEventToWebview(EthereumEventsDeprecated.NETWORK_CHANGED, data);
        break;
      case EthereumEvents.CHAIN_CHANGED:
        this.emitEventToWebview(EthereumEventsDeprecated.CHAIN_ID_CHANGED, data);
        this.emitEventToWebview(EthereumEventsDeprecated.NETWORK_CHANGED, data);
        break;
      case EthereumEvents.DISCONNECTED:
        this.emitEventToWebview(EthereumEventsDeprecated.CLOSE, data);
        break;
      default:
        break;
    }
  };

  public emitEventToWebview = (event: EthereumEvents | EthereumEventsDeprecated, data: RequestResponse): void => {
    this.executeJS(`window.ethereum?.emit('${event}', ${data ? JSON.stringify(data) : '{}'})`);
  };

  private executeJS = (js: string): void => {
    if (!this.webviewRef) {
      console.error("there's no webviewRef");
      return;
    }
    this.webviewRef.injectJavaScript(js);
  };
}

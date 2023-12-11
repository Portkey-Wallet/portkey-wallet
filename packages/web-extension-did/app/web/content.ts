import InternalMessage from './messages/InternalMessage';
import { apis } from './utils/BrowserApis';
import { getUrl } from './utils/getHostname';
import { runWorkerKeepAliveInterval } from 'utils/keepAlive';
import { checkForError } from 'utils';
import { ContentPostStream } from '@portkey/extension-provider';
import {
  MethodsWallet,
  IRequestParams,
  MethodsType,
  ProviderError,
  ResponseMessagePreset,
  ResponseCode,
} from '@portkey/provider-types';
import { generateErrorResponse, generateNormalResponse } from '@portkey/provider-utils';
import { getFaviconUrl } from '@portkey-wallet/utils/dapp/browser';
import { isMethodsBase, isMethodsUnimplemented } from '@portkey/providers';
import { isMethodsWalletMessage } from 'messages/utils';
/**
 * Don't run the keep-worker-alive logic for JSON-RPC methods called on initial load.
 * This is to prevent the service worker from being kept alive when accounts are not
 * connected to the dapp or when the user is not interacting with the extension.
 * The keep-alive logic should not work for non-dapp pages.
 */
const IGNORE_INIT_METHODS_FOR_KEEP_ALIVE: string[] = [MethodsWallet.GET_WALLET_STATE];

const EXTENSION_CONTEXT_INVALIDATED_CHROMIUM_ERROR = 'Extension context invalidated.';
// The stream that connects between the content script and the website
let pageStream: ContentPostStream;
const CONTENT_TARGET = 'portkey-content';
const INPAGE_TARGET = 'portkey-inpage';

// The filename of the injected communication script.
const INJECTION_SCRIPT_FILENAME = 'js/inject.js';

let extensionPort: chrome.runtime.Port | null;

/**
 * This listener destroys the extension streams when the extension port is disconnected,
 * so that streams may be re-established later when the extension port is reconnected.
 */
const onDisconnectDestroyStreams = () => {
  const err = checkForError();

  extensionPort?.onDisconnect.removeListener(onDisconnectDestroyStreams);

  /**
   * If an error is found, reset the streams. When running two or more dapps, resetting the service
   * worker may cause the error, "Error: Could not establish connection. Receiving end does not
   * exist.", due to a race-condition. The disconnect event may be called by runtime.connect which
   * may cause issues. We suspect that this is a chromium bug as this event should only be called
   * once the port and connections are ready. Delay time is arbitrary.
   */
  if (err) {
    console.warn(`${err} Resetting the streams.`);
    setTimeout(() => {
      new Content();
    }, 1000);
  }
};

/**
 * When the extension background is loaded it sends the EXTENSION_MESSAGES.READY message to the browser tabs.
 * This listener/callback receives the message to set up the streams after service worker in-activity.
 *
 * @param {object} msg
 * @param {string} msg.name - custom property and name to identify the message received
 * @returns {Promise|undefined}
 */
const onMessageSetUpExtensionStreams = (msg: any) => {
  console.log(msg, 'onMessageSetUpExtensionStreams');
  // if (msg.name === EXTENSION_MESSAGES.READY) {
  //   if (!stream) {
  //     new Content();
  //   }
  //   return Promise.resolve(`Portkey_did: handled ${EXTENSION_MESSAGES.READY}`);
  // }
  return undefined;
};

/***
 * The content script is what gets run on the application.
 * It also injects and instance of Scatterdapp
 */
class Content {
  constructor() {
    this.setupPageStream();
    this.injectInteractionScript();
    this.extensionWatch();
  }

  static keepConnect() {
    // keepSWActive({
    //   name: WORKER_KEEP_ALIVE_MESSAGE,
    //   onMessageListener: Content.onMessageListener,
    // });
    extensionPort = apis.runtime.connect({ name: 'CONTENT_SCRIPT' });
    extensionPort.onDisconnect.addListener(onDisconnectDestroyStreams);
    apis.runtime.onMessage.addListener(onMessageSetUpExtensionStreams);
    runWorkerKeepAliveInterval();
  }

  static async onMessageListener(message: any) {
    console.log(message, 'onMessageListener===');
  }

  extensionWatch() {
    apis.runtime.onMessage.addListener((message, _sender, sendResponse) => {
      this.respond({ ...message, target: INPAGE_TARGET });
      sendResponse(true);
    });
  }

  respond(msg: any) {
    try {
      console.log('respond:', msg);
      pageStream.send(msg);
    } catch (error) {
      console.error(error, 'respond');
    }
  }

  setupPageStream() {
    // Setting up a new encrypted stream for
    // interaction between the extension and the application
    pageStream = new ContentPostStream({ name: CONTENT_TARGET });

    pageStream.on('data', (data: Buffer) => {
      const params = JSON.parse(data.toString());

      this.contentListener(params);
    });

    Content.keepConnect();

    const err = checkForError();
    if (err) {
      err.message === EXTENSION_CONTEXT_INVALIDATED_CHROMIUM_ERROR
        ? console.error(`Please refresh the page. Portkey: ${err}`)
        : console.error(`Portkey: ${err}`);
    }
  }

  /***
   * Injecting the interaction script into the application.
   * This injects an encrypted stream into the application which will
   * sync up with the one here.
   */
  injectInteractionScript() {
    const script = document.createElement('script');
    script.src = apis.runtime.getURL(INJECTION_SCRIPT_FILENAME);
    (document.head || document.documentElement).appendChild(script);
    console.log(script.src, 'injectInteractionScript');
    script.onload = () => {
      console.log('portkey inject.js onload!!!');
      script.remove();
    };
  }

  methodCheck = (method: string): method is MethodsType => {
    return isMethodsBase(method) || isMethodsUnimplemented(method) || isMethodsWalletMessage(method);
  };

  contentListener(input: IRequestParams) {
    const URL = getUrl();
    const icon = getFaviconUrl(URL.href, 50);

    const message = Object.assign({}, input, {
      hostname: URL.hostname,
      origin: URL.origin,
      href: URL.href,
      icon,
    });

    const method = message.method;
    console.log('contentListener=message: ', message);
    console.log(this.methodCheck(method), 'methodCheck');
    if (!IGNORE_INIT_METHODS_FOR_KEEP_ALIVE.includes(method)) {
      runWorkerKeepAliveInterval();
    }
    if (!this.methodCheck(method)) {
      return this.respond(new ProviderError(ResponseMessagePreset['UNKNOWN_METHOD'], ResponseCode.UNKNOWN_METHOD));
    }
    this.internalCommunicate(method, message);
  }

  internalCommunicate(method: string, message: any) {
    InternalMessage.payload(method, message)
      .send()
      .then((result) => {
        delete message.payload;
        let response;
        if (!result) return;
        if (result.error === 0) {
          response = generateNormalResponse({
            ...message,
            data: result.data,
            target: INPAGE_TARGET,
          });
          // send response to the page
        } else {
          response = generateErrorResponse({ ...message, ...result.data, msg: result.message, target: INPAGE_TARGET });
        }
        console.log(result, response, 'result===internalCommunicate');

        this.respond(response);
      })
      .catch((error) => {
        delete message.payload;
        this.respond(
          generateErrorResponse({
            ...message,
            code: ResponseCode.INTERNAL_ERROR,
            msg: 'Chrome internal error, please reload page',
            target: INPAGE_TARGET,
          }),
        );
        console.error('internalCommunicate', error);
      });
  }
}

new Content();

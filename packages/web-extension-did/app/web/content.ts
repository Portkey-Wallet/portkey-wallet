import InternalMessage from './messages/InternalMessage';
import { apis } from './utils/BrowserApis';
import { getUrl } from './utils/getHostname';
import { runWorkerKeepAliveInterval } from 'utils/keepAlive';
import { checkForError } from 'utils';
import { ContentPostStream } from '@portkey/extension-provider';
import { MethodsUnimplemented, IRequestParams } from '@portkey/provider-types';
import { generateErrorResponse, generateNormalResponse } from '@portkey/provider-utils';
/**
 * Don't run the keep-worker-alive logic for JSON-RPC methods called on initial load.
 * This is to prevent the service worker from being kept alive when accounts are not
 * connected to the dapp or when the user is not interacting with the extension.
 * The keep-alive logic should not work for non-dapp pages.
 */
const IGNORE_INIT_METHODS_FOR_KEEP_ALIVE: string[] = [MethodsUnimplemented.GET_WALLET_STATE];

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
      this.respond(message);
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
    pageStream = new ContentPostStream({ name: CONTENT_TARGET, postWindow: window });

    pageStream.on('data', (data: Buffer) => {
      const params = JSON.parse(data.toString());

      this.contentListener(params);
    });

    Content.keepConnect();
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

  contentListener(input: IRequestParams) {
    const message = Object.assign({}, input, {
      hostname: getUrl().hostname,
      origin: getUrl().origin,
      href: getUrl().href,
    });

    const method = message.method;
    console.log('contentListener=message: ', message);

    if (!IGNORE_INIT_METHODS_FOR_KEEP_ALIVE.includes(method)) {
      runWorkerKeepAliveInterval();
    }

    this.internalCommunicate(method, message);
  }

  internalCommunicate(method: string, message: any) {
    InternalMessage.payload(method, message)
      .send()
      .then((result) => {
        delete message.payload;
        let response;
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
      });
  }
}

new Content();

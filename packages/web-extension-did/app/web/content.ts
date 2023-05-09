import IdGenerator from './utils/IdGenerator';
import EncryptedStream from './utils/EncryptedStream';
import * as PageContentTags from './messages/PageContentTags';
import InternalMessageTypes, { MethodMessageTypes } from './messages/InternalMessageTypes';
import InternalMessage from './messages/InternalMessage';
import { apis } from './utils/BrowserApis';
import { getUrl } from './utils/getHostname';
import errorHandler, { PortKeyResultType } from './utils/errorHandler';
import { unrestrictedMethods } from 'messages/unrestrictedMethods';
import { runWorkerKeepAliveInterval } from 'utils/keepAlive';
import { checkForError } from 'utils';
/**
 * Don't run the keep-worker-alive logic for JSON-RPC methods called on initial load.
 * This is to prevent the service worker from being kept alive when accounts are not
 * connected to the dapp or when the user is not interacting with the extension.
 * The keep-alive logic should not work for non-dapp pages.
 */
const IGNORE_INIT_METHODS_FOR_KEEP_ALIVE = [MethodMessageTypes.GET_WALLET_STATE];

// The stream that connects between the content script
// and the website
let stream: EncryptedStream;

// The filename of the injected communication script.
const INJECTION_SCRIPT_FILENAME = 'js/inject.js';

interface RespondPayload extends PortKeyResultType {
  sid: string;
  message?: string;
}

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
  aesKey: string;
  constructor() {
    this.aesKey = IdGenerator.text(256);
    this.setupEncryptedStream();
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

  setupEncryptedStream() {
    // Setting up a new encrypted stream for
    // interaction between the extension and the application
    stream = new EncryptedStream(PageContentTags.CONTENT_PORTKEY, this.aesKey);

    stream.addEventListener((result) => {
      console.log(result, 'setupEncryptedStream====content');
      this.contentListener(result);
    });

    stream.setupEstablishEncryptedCommunication(PageContentTags.PAGE_PORTKEY);
    // stream.sendPublicKey(PageContentTags.PAGE_PORTKEY);
    Content.keepConnect();
  }

  respond(payload: RespondPayload) {
    stream.send(payload, PageContentTags.PAGE_PORTKEY);
  }

  getVersion() {
    return 'beta';
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
      console.log('portKey_did inject.js onload!!!');
      script.remove();
    };
  }

  contentListener(input: any) {
    const message = Object.assign({}, input, {
      hostname: getUrl().hostname,
      origin: getUrl().origin,
      href: getUrl().href,
    });

    console.log('contentListener: ', message, location.host || location.hostname);
    // message: sid, method, appName, hostname, params
    const { method, sid } = message;
    console.log('message: ', message);

    if (!IGNORE_INIT_METHODS_FOR_KEEP_ALIVE.includes(method)) {
      runWorkerKeepAliveInterval();
    }
    if (method === InternalMessageTypes.CHECK_CONTENT) {
      this.respond({
        sid,
        ...errorHandler(0, 'Refuse'),
        message: 'Portkey is ready.',
      });
      return;
    }

    if (method === InternalMessageTypes.OPEN_PROMPT) {
      if (!unrestrictedMethods.includes(message.payload.method)) {
        this.respond({
          sid,
          ...errorHandler(
            400001,
            `${message.payload.method} is illegal method. ${unrestrictedMethods.join(', ')} are legal.`,
          ),
        });
        return;
      }
    } else if (!unrestrictedMethods.includes(message.method)) {
      this.respond({
        sid,
        ...errorHandler(400001, `${message.method} is illegal method. ${unrestrictedMethods.join(', ')} are legal.`),
      });
      return;
    }

    this.internalCommunicate(method, message);
  }

  internalCommunicate(method: keyof typeof InternalMessageTypes, message: any) {
    InternalMessage.payload(method, message)
      .send()
      .then((result) => {
        const data = {
          ...result,
          sid: message.sid,
        };
        console.log(method, result, 'back');
        this.respond({
          ...errorHandler(0),
          ...data,
        });
      });
  }
}

new Content();

import AES from 'crypto-js/aes';

/***
 * Used for communication between a web page and an extension's content script.
 * Data passed between the two is encrypted to fight man-in-the-middle attacks.
 */
export class EncryptedStream {
  eventName: string;
  private key: string;
  private synced: boolean;
  private syncFn: any;

  /***
   * Creates a new EncryptedStream
   * @param _eventName - The name of this stream
   * @param _randomized - A randomized key used for encryption
   */
  constructor(_eventName: string, _randomized: string) {
    this.eventName = _eventName;
    this.key = _randomized;
    this.synced = false;
    this.syncFn = null;
    this.listenForSync();
  }

  /***
   * Message listener that returns decrypted messages when synced
   * @param func - A message handler method
   */
  listenWith(func: any) {
    document.addEventListener(this.eventName, (event: any): any => {
      if (!this.synced) return false;
      let msg = JSON.parse(event.detail);
      msg = this.synced || typeof msg === 'string' ? AES.decrypt(msg, this.key) : msg;
      func(msg);
    });
  }

  /***
   * Message sender which encrypts messages and adds the sender
   * @param data - The payload to send
   * @param to - The stream to send messages to
   */
  send(data: any, to: string): void {
    const addSender = () => {
      data.from = this.eventName;
    };
    const encryptIfSynced = () => {
      data = this.synced ? AES.encrypt(data, this.key) : data;
    };

    if (typeof data !== 'object') throw new Error('Payloads must be objects');
    addSender();
    encryptIfSynced();
    this.dispatch(JSON.stringify(data), to);
  }

  /***
   * Sync handler, binds a callback function that is called when the stream syncs with another.
   * @param fn - A function to be called upon sync
   */
  onSync(fn: any) {
    this.syncFn = fn;
  }

  /***
   * Call to sync this stream with another using a randomized key which is used for encryption
   * @param to - The other stream's name
   * @param handshake - The key to encrypt with
   */
  sync(to: string, handshake: string) {
    this.send({ type: 'sync', handshake }, to);
  }

  /***
   * Handles syncing and acking of stream pairs
   */
  private listenForSync() {
    document.addEventListener(this.eventName, (event: any): any => {
      const msg = JSON.parse(event.detail);
      if (!('type' in msg)) return false;
      if (msg.type === 'sync') this.ackSync(msg);
      if (msg.type === 'synced') this.synced = true;
    });
  }

  /***
   * Gets called when this stream receives a 'sync' messages.
   * @param msg - The sync message
   */
  private ackSync(msg: any) {
    this.send({ type: 'synced' }, msg.from);
    this.key = msg.handshake;
    this.synced = true;
    this.syncFn();
  }

  // Helper methods for building and sending events.
  private dispatch(encryptedData: any, to: string) {
    document.dispatchEvent(this.getEvent(encryptedData, to));
  }
  private getEvent(encryptedData: any, to: string) {
    return new CustomEvent(to, this.getEventInit(encryptedData));
  }
  private getEventInit(encryptedData: any) {
    return { detail: encryptedData };
  }
}

export default EncryptedStream;

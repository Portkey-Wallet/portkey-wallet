// use Asymmetric encryption to transfer the key.
// And use AES to cryto the message.
// For one-to-one
// If you call setupEstablishEncryptedCommunication
// you will get an encrypted communication.

// Demo
// One Side
// stream = new EncryptedStream(PageContentTags.PAGE_PORTKEY, this.aesKey);
// stream.addEventListener(result => {
//     handlePendingPromise(result);
// });
// stream.setupEstablishEncryptedCommunication(PageContentTags.CONTENT_PORTKEY).then(ready => {
//     this.initNightElf();
// });
// stream.sendPublicKey(PageContentTags.CONTENT_PORTKEY);
// The other side
// stream = new EncryptedStream(PageContentTags.CONTENT_PORTKEY, this.aesKey);
// stream.addEventListener(result => {
//     this.contentListener(result);
// });
// stream.setupEstablishEncryptedCommunication(PageContentTags.PAGE_PORTKEY);

import AESUtils from './AESUtils';

import elliptic from 'elliptic';
import { CustomEventType } from '../types';

// interface CustomEventType ex
const EC = elliptic.ec;
const ec = new EC('curve25519');
export default class EncryptStream {
  _eventName: string;
  _aesKey: string;
  publicKeyHasSent?: boolean;
  publicKeyOfTheOtherParty?: string;
  aesKeyOfTheOtherParty?: string;
  keyPair: elliptic.ec.KeyPair;
  publicKeyHex: string;

  constructor(eventName: string, aesKey: string) {
    this._eventName = eventName;
    this._aesKey = aesKey;

    this.publicKeyHasSent;
    this.publicKeyOfTheOtherParty;
    this.aesKeyOfTheOtherParty;

    this.keyPair = ec.genKeyPair();
    this.publicKeyHex = this.keyPair.getPublic().encode('hex', true);
  }

  getDecodePublicKeyFromHex(
    publicKeyHex:
      | string
      | elliptic.ec.KeyPair
      | Uint8Array
      | Buffer
      | number[]
      | {
          x: string;
          y: string;
        },
  ) {
    return ec.keyFromPublic(publicKeyHex, 'hex').getPublic();
  }

  getSharedKey(publicKeyHex: string) {
    const publicKey = this.getDecodePublicKeyFromHex(publicKeyHex);
    return this.keyPair.derive(publicKey).toString();
  }

  addEventListener(callback: (v: any) => void) {
    document.addEventListener(this._eventName, (event: CustomEventType) => {
      let message;
      // console.log('-------- addEventListener -----------', message);
      if (this.aesKeyOfTheOtherParty) {
        message = JSON.parse(AESUtils.decrypt(event.detail ?? '{}', this.aesKeyOfTheOtherParty));
      } else {
        message = JSON.parse(event.detail ?? '{}');
      }
      callback(message);
    });
  }

  // EEC: EstablishEncryptedCommunication
  setupEstablishEncryptedCommunication(to: string) {
    return new Promise((resolve) => {
      // event
      document.addEventListener(this._eventName + '_establishEncryptedCommunication', (event: CustomEventType) => {
        const message = JSON.parse(event?.detail ?? '{}');
        const { method } = message;
        if (method === 'publicKey' && !this.publicKeyOfTheOtherParty) {
          if (!this.publicKeyHasSent) {
            this.publicKeyOfTheOtherParty = message.publicKey;
            this.sendPublicKey(to);
            // console.log('in addEventListenerOfEEC:: publicKey ::', this._eventName);
          }
          this.sendEncryptedAESKey(to);
          return;
        }
        if (method === 'aesKey') {
          const sharedKey = this.getSharedKey(this.publicKeyOfTheOtherParty || '');
          const decryptAESKey = AESUtils.decrypt(message.aesKey, sharedKey);
          this.aesKeyOfTheOtherParty = decryptAESKey;
          resolve(true);
        }
      });
    });
  }

  sendEncryptedAESKey(to: string) {
    const sharedKey = this.getSharedKey(this.publicKeyOfTheOtherParty || '');
    const encryptedAESKey = AESUtils.encrypt(this._aesKey, sharedKey);
    this.sendOfEEC(
      {
        method: 'aesKey',
        aesKey: encryptedAESKey,
      },
      to,
    );
  }

  sendOfEEC(
    data: {
      method: string;
      aesKey?: string;
      publicKey?: string;
    },
    to: string,
  ) {
    const event = new CustomEvent(to + '_establishEncryptedCommunication', {
      detail: JSON.stringify(data),
    });
    document.dispatchEvent(event);
  }

  sendPublicKey(to: string) {
    this.sendOfEEC(
      {
        method: 'publicKey',
        // publicKey: this.publicKey.toString('hex')
        publicKey: this.publicKeyHex,
      },
      to,
    );
    this.publicKeyHasSent = true;
  }

  send(payload: any, to: string) {
    let data = { ...payload, from: this._eventName };
    data = JSON.stringify(data);

    if (this.aesKeyOfTheOtherParty) {
      data = AESUtils.encrypt(data, this._aesKey);
    }
    const event = new CustomEvent(to, {
      detail: data,
    });

    document.dispatchEvent(event);
  }
}

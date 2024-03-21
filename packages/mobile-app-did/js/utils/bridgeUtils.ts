import queryString from 'query-string';
import { WebViewRequestTypes } from '../components/CommonWebView/types/types';
import { ec } from 'elliptic';
import { decode, encode } from 'base-64';

import { MESSAGE_PREFIX } from '../constants/webview';
import * as uuid from 'uuid';

export const deserializeMessage = (str: string): WebViewRequestTypes | string | boolean => {
  if (typeof str === 'string' && str.startsWith(MESSAGE_PREFIX)) {
    const strs = str.split('?');
    if (str.length > 0 && strs.length === 2) {
      let result = (queryString.parse(strs[1]).params as string) || '';
      const deCodeResult = decodeURIComponent(decode(result));
      try {
        result = JSON.parse(deCodeResult);
      } catch (e) {}
      return result;
    }
    return false;
  }
  return false;
};

export const serializeMessage = (data: any) => {
  let result = JSON.stringify(data);
  if (data === null || data === undefined) {
    result = '';
  }
  return encode(encodeURIComponent(result));
};

export const randomId = () => uuid.v4().replace(/-/g, '');

export const isValidHexString = (str: string) => /^(0x)?[0-9a-fA-F]+$/.test(str);

/**
 * sign message with keyPair
 * @param {string|Buffer|Uint8Array} msg hex string or Buffer array
 * @param {Object} keyPair ecc keyPair
 * @return {string}
 */
export const sign = (msg: string | Buffer | Uint8Array, keyPair: ec.KeyPair) => {
  const signedMsg = keyPair.sign(msg);
  return [
    signedMsg.r.toString(16, 64),
    signedMsg.s.toString(16, 64),
    `0${(signedMsg.recoveryParam || {}).toString()}`,
  ].join('');
};

/**
 * verify signature
 * @param {string|Buffer|Uint8Array} msg hex string or buffer array
 * @param {string} signature hex string
 * @param {Object} keyPair ecc keyPair
 * @return {boolean|Object}
 */
export const verify = (msg: string | Buffer | Uint8Array, signature: string, keyPair: ec.KeyPair) => {
  const r = signature.slice(0, 64);
  const s = signature.slice(64, 128);
  const recoveryParam = signature.slice(128);
  const signatureObj = {
    r,
    s,
    recoveryParam,
  };
  try {
    let result;
    if (Array.isArray(keyPair)) {
      result = keyPair.find(ele => ele.verify(msg, signatureObj) === true).length > 0;
    } else {
      result = keyPair.verify(msg, signatureObj as any);
    }

    return result;
  } catch (e) {
    return false;
  }
};

// export const dispatchMessage = (message, eventId = '') => {
//   let event;
//   try {
//     event = new MessageEvent('message', {
//       data: message,
//       origin: window.location.origin,
//       lastEventId: eventId,
//     });
//   } catch (e) {
//     event = document.createEvent('MessageEvent');
//     event.initMessageEvent('message', true, true, message, window.location.origin, eventId);
//   }
// };

export const checkTimestamp = (time: string, timeBuffer = 240) => {
  const checkTime = parseInt(time, 10);
  if (!checkTime) {
    return false;
  }
  const now = Math.ceil(Date.now() / 1000);
  const diff = now - checkTime;
  return diff >= 0 && diff <= timeBuffer;
};

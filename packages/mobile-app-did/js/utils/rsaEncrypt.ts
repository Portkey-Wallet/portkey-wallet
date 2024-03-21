import crypto from 'react-native-crypto';
import { Buffer } from 'buffer';
const RSA_PKCS1_PADDING = 1;

export const rsaEncrypt = (message: string, pubKey: string, paddingNumber: string | number = RSA_PKCS1_PADDING) => {
  const padding = 117;
  const count = message.length;

  const num = Math.floor(count / padding);
  const remainder = count % padding;
  let str = '';
  for (let i = 0; i < num; i++) {
    const buffer = Buffer.from(message.slice(i * padding, i * padding + padding), 'utf8');
    const encryptMessage = crypto.publicEncrypt({ key: pubKey, padding: paddingNumber }, buffer);
    str += encryptMessage.toString('base64');
    str += ';';
  }
  if (remainder !== 0) {
    const buffer = Buffer.from(message.slice(-remainder), 'utf8');
    const encryptMessage = crypto.publicEncrypt({ key: pubKey, padding: paddingNumber }, buffer);
    str += encryptMessage.toString('base64');
    str += ';';
  }
  if (str.length > 0) str = str.slice(0, str.length - 1);
  return str;
};

export const rsaEncryptObj = (
  data: any = {},
  pubKey: string,
  paddingNumber: string | number = RSA_PKCS1_PADDING,
): [string, object] => {
  const newObj: any = {};
  let body = '';
  const list = Object.entries(data);
  for (let i = 0; i < list.length; i++) {
    const [key, value] = list[i];
    const encryptMessage = rsaEncrypt(String(value), pubKey, paddingNumber);
    const message = encodeURIComponent(encryptMessage);
    newObj[key] = message;
    body += key + '=' + message + '&';
  }
  body = body.slice(0, body.length - 1);

  return [body, newObj];
};

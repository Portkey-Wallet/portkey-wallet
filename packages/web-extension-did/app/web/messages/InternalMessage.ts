import { LocalStream } from 'utils/extensionStreams';
import type { SendResponseParams } from 'types';
import { InternalMessageData } from 'types/SW';
import errorHandler from 'utils/errorHandler';

export const timeoutPromise = (delay?: number): Promise<SendResponseParams> => {
  return new Promise((resolve) => {
    const ids = setTimeout(() => {
      clearTimeout(ids);
      resolve({ ...errorHandler(200006), data: 'timeout' });
    }, delay);
  });
};

export default class InternalMessage {
  type: string | number;
  payload: any;
  constructor() {
    this.type = '';
    this.payload = '';
  }

  static placeholder() {
    return new InternalMessage();
  }
  static fromJson(json: any): InternalMessageData {
    return Object.assign(this.placeholder(), json);
  }

  static payload<T = any>(type: string | number, payload?: T) {
    const p = this.placeholder();
    p.type = type;
    p.payload = payload;
    return p;
  }

  static signal(type: string) {
    const p = this.placeholder();
    p.type = type;
    return p;
  }

  async send() {
    return LocalStream.send(this) as Promise<SendResponseParams>;
  }
}

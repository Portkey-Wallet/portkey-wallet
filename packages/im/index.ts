import RelationIM, { Im } from '@relationlabs/im';
import * as utils from './utils';
import { AElfWallet } from '@portkey-wallet/types/aelf';
import { IMStatusEnum } from './types';
import { sleep } from '@portkey-wallet/utils';

class IM {
  private _imInstance?: RelationIM;
  public status = IMStatusEnum.INIT;
  private _token?: string;
  private msgObservers: Record<string, (e: any) => void> = {};
  private errorObservers: Record<string, (e: any) => void> = {};
  public userInfo?: {
    avatar: string;
    name: string;
    relationId: string;
  };

  constructor() {}

  async init(account: AElfWallet, caHash: string) {
    if (this._imInstance) return;

    if (this.status === IMStatusEnum.AUTHORIZING) {
      throw new Error('IM is authorizing');
    }
    this.status = IMStatusEnum.AUTHORIZING;
    const token = await utils.sign(`${Date.now()}`, account, caHash);
    if (!token) {
      throw new Error('Can not get im token');
    }
    this.status = IMStatusEnum.AUTHORIZED;
    this._token = token;
    this.initRelationIM();
  }

  initRelationIM() {
    if (!this._token) {
      throw new Error('IM token is not exist');
    }

    const APIKEY = '581c6c4fa0b54912b00088aa563342a4';
    this._imInstance = RelationIM.init({ token: this._token, apiKey: APIKEY, connect: true, refresh: true });
    this.listenRelationIM(this._imInstance);
    this._imInstance.getUserInfo().then(result => {
      console.log('getUserInfo', result.data);
      this.userInfo = result.data;
    });
  }

  listenRelationIM(imInstance: RelationIM) {
    imInstance.bind(Im.CONNECT_OK, () => {
      console.log('CONNECT_OK');
      this.status = IMStatusEnum.CONNECTED;
    });

    imInstance.bind(Im.CONNECT_ERR, (e: any) => {
      console.log('CONNECT_ERR msg', e);
      this.status = IMStatusEnum.ERROR;
    });
    imInstance.bind(Im.CONNECT_CLOSE, async (e: any) => {
      console.log('CONNECT_CLOSE msg', e);
      this.status = IMStatusEnum.ERROR;
      await sleep(1000);
      this.updateErrorObservers(e);
      try {
        this.initRelationIM();
      } catch (error) {
        console.log('initRelationIM error', error);
      }
    });

    imInstance.bind(Im.RECEIVE_MSG_OK, (e: any) => {
      console.log('RECEIVE_MSG_OK msg', e);
      this.updateMsgObservers(e);
    });
  }

  getInstance() {
    return this._imInstance;
  }

  registerMsgObserver(cb: (e: any) => void) {
    const key = `${Date.now()}`;
    this.msgObservers[key] = cb;
    return key;
  }

  removeMsgObserver(key: string) {
    delete this.msgObservers[key];
  }

  updateMsgObservers(e: any) {
    Object.keys(this.msgObservers).forEach(key => {
      this.msgObservers[key](e);
    });
  }

  registerErrorObserver(cb: (e: any) => void) {
    const key = `${Date.now()}`;
    this.errorObservers[key] = cb;
    return key;
  }

  removeErrorObserver(key: string) {
    delete this.errorObservers[key];
  }

  updateErrorObservers(e: any) {
    Object.keys(this.errorObservers).forEach(key => {
      this.errorObservers[key](e);
    });
  }
}

const im = new IM();

export default im;
export { utils };
export * from './types';

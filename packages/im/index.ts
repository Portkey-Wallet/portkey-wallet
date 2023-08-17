import RelationIM, { Im } from '@relationlabs/im';
import * as utils from './utils';
import { AElfWallet } from '@portkey-wallet/types/aelf';
import { IMStatusEnum, Message, MessageCount } from './types';
import { sleep } from '@portkey-wallet/utils';

class IM {
  private _imInstance?: RelationIM;
  private _token?: string;
  private _msgObservers: Map<string, Map<Symbol, (e: any) => void>> = new Map();
  private _channelMsgObservers: Map<string, Map<Symbol, (e: any) => void>> = new Map();
  private _unreadMsgObservers: Map<Symbol, (e: any) => void> = new Map();
  private _errorObservers: Map<Symbol, (e: any) => void> = new Map();
  private _msgCount: MessageCount = {
    unreadCount: 0,
    mentionsCount: 0,
  };
  private _msgCountObservers: Map<Symbol, (e: MessageCount) => void> = new Map();

  public status = IMStatusEnum.INIT;
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

  registerUnreadMsgObservers(cb: (e: any) => void) {
    const symbol = Symbol();
    const unreadMsgObservers = this._unreadMsgObservers;
    unreadMsgObservers.set(symbol, cb);
    return {
      remove: () => {
        unreadMsgObservers.has(symbol) && unreadMsgObservers.delete(symbol);
      },
    };
  }

  updateUnreadMsgObservers(e: any) {
    this._unreadMsgObservers.forEach(cb => {
      cb(e);
    });
  }

  registerChannelMsgObserver(channelId: string, cb: (e: any) => void) {
    const symbol = Symbol();
    const channelMsgObservers = this._channelMsgObservers;

    let channelObservers = channelMsgObservers.get(channelId);
    if (channelObservers) {
      channelObservers.set(symbol, cb);
    } else {
      channelObservers = new Map([[symbol, cb]]);
      channelMsgObservers.set(channelId, channelObservers);
    }

    return {
      remove: () => {
        const channelObservers = channelMsgObservers.get(channelId);
        if (!channelObservers) return;
        channelObservers.has(symbol) && channelObservers.delete(symbol);
        if (channelObservers.size === 0) {
          channelMsgObservers.delete(channelId);
        }
      },
    };
  }

  updateMsgObservers(e: any) {
    const rawMsg: Message = e['im-message'];
    const channelId = rawMsg.channelUuid;
    const channelObservers = this._channelMsgObservers.get(channelId);
    if (channelObservers) {
      channelObservers.forEach(cb => {
        cb(e);
      });
    } else {
      // no observer, update message unreadCount
      this.updateUnreadMsgObservers(e);
      this.updateMessageCount({
        ...this._msgCount,
        unreadCount: this._msgCount.unreadCount + 1,
      });
    }
  }

  registerErrorObserver(cb: (e: any) => void) {
    const symbol = Symbol();
    const errorObservers = this._errorObservers;
    errorObservers.set(symbol, cb);
    return {
      remove: () => {
        errorObservers.has(symbol) && errorObservers.delete(symbol);
      },
    };
  }

  updateErrorObservers(e: any) {
    this._errorObservers.forEach(cb => {
      cb(e);
    });
  }

  getMessageCount(): MessageCount {
    return (
      this._msgCount || {
        unreadCount: 0,
        mentionsCount: 0,
      }
    );
  }

  registerMessageCountObserver(cb: (e: MessageCount) => void) {
    const symbol = Symbol();
    const msgCountObservers = this._msgCountObservers;
    msgCountObservers.set(symbol, cb);
    return {
      remove: () => {
        msgCountObservers.has(symbol) && msgCountObservers.delete(symbol);
      },
    };
  }

  updateMessageCount(e: MessageCount) {
    this._msgCount = e;
    this._msgCountObservers.forEach(cb => {
      cb(e);
    });
  }
}

const im = new IM();

export default im;
export { utils };
export * from './types';

import RelationIM, { Im, config as relationConfig } from '@relationlabs/im';
import * as utils from './utils';
import { AElfWallet } from '@portkey-wallet/types/aelf';
import { IMStatusEnum, MessageCount, SocketMessage } from './types';
import { sleep } from '@portkey-wallet/utils';
import { IIMService } from './types/service';
import { IMConfig } from './config';
import { FetchRequest } from '@portkey/request';
import { IBaseRequest } from '@portkey/types';
import { IMService } from './service';
import { IM_TOKEN_ERROR_ARRAY } from './constant';
import { request } from '@portkey-wallet/api/api-did';

export class IM {
  private _imInstance?: RelationIM;

  private _channelMsgObservers: Map<string, Map<Symbol, (e: any) => void>> = new Map();
  private _unreadMsgObservers: Map<Symbol, (e: any) => void> = new Map();
  private _errorObservers: Map<Symbol, (e: any) => void> = new Map();
  private _msgCountObservers: Map<Symbol, (e: MessageCount) => void> = new Map();
  private _msgCount: MessageCount = {
    unreadCount: 0,
    mentionsCount: 0,
  };
  private _account?: AElfWallet;
  private _caHash?: string;

  public status = IMStatusEnum.INIT;
  public userInfo?: {
    avatar: string;
    name: string;
    relationId: string;
  };

  public config: IMConfig;
  public service: IIMService;
  public fetchRequest: IBaseRequest;

  constructor() {
    this.config = new IMConfig({
      requestDefaults: {
        headers: {
          'R-Authorization': 'invalid_authorization',
          Accept: 'application/json, text/plain, */*',
        },
      },
    });

    this.fetchRequest = new FetchRequest(this.config.requestConfig);
    this.service = new IMService(this.fetchRequest);

    this.rewriteFetch();
  }

  async init(account: AElfWallet, caHash: string) {
    this.status = IMStatusEnum.INIT;
    this._account = account;
    this._caHash = caHash;

    return this.initRelationIM();
  }

  async initRelationIM() {
    if (!this._account || !this._caHash) {
      throw new Error('no account or caHash');
    }
    if (this.status === IMStatusEnum.AUTHORIZING) {
      throw new Error('IM is authorizing');
    }
    this.status = IMStatusEnum.AUTHORIZING;
    try {
      const account = this._account;
      const caHash = this._caHash;
      const { data: verifyResult } = await this.service.verifySignatureLoop(
        () => {
          return utils.getVerifyData(account, caHash);
        },
        () => {
          return caHash === this._caHash;
        },
      );
      const addressAuthToken = verifyResult.token;
      const { data: autoResult } = await this.service.getAuthTokenLoop(
        {
          addressAuthToken,
        },
        () => {
          return caHash === this._caHash;
        },
      );

      const token = autoResult.token;
      this.setAuthorization(token);

      this._imInstance = RelationIM.init({ token, apiKey: undefined as any, connect: true, refresh: true });
      this.bindRelation(this._imInstance);

      this.status = IMStatusEnum.AUTHORIZED;

      this.refreshMessageCount();
      if (this.userInfo) {
        return this.userInfo;
      }
      const { data: userInfo } = await this.service.getUserInfo();
      this.userInfo = userInfo;
      return userInfo;
    } catch (error) {
      console.log('init error', error);
      this.status = IMStatusEnum.INIT;
      throw error;
    }
  }

  bindRelation(imInstance: RelationIM) {
    imInstance.bind(Im.CONNECT_OK, this.onConnectOk);
    imInstance.bind(Im.CONNECT_ERR, this.onConnectErr);
    imInstance.bind(Im.CONNECT_CLOSE, this.onConnectClose);
    imInstance.bind(Im.RECEIVE_MSG_OK, this.onReceiveMessage);
  }

  bindOffRelation() {
    if (!this._imInstance) return;
    const imInstance = this._imInstance;
    imInstance.bindOff(Im.CONNECT_OK, this.onConnectOk);
    imInstance.bindOff(Im.CONNECT_ERR, this.onConnectErr);
    imInstance.bindOff(Im.CONNECT_CLOSE, this.onConnectClose);
    imInstance.bindOff(Im.RECEIVE_MSG_OK, this.onReceiveMessage);
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

  onConnectOk(_e: any) {
    console.log('CONNECT_OK');
  }

  onConnectErr(e: any) {
    console.log('CONNECT_ERR', e);
  }

  onConnectClose = async (e: any) => {
    console.log('CONNECT_CLOSE msg', e);
    if (this.status === IMStatusEnum.DESTROY) {
      console.log('CONNECT_CLOSE DESTROY');
      return;
    }
    this.bindOffRelation();
    this.updateErrorObservers(e);

    await sleep(1000);
    try {
      this.status = IMStatusEnum.INIT;
      this.initRelationIM();
    } catch (error) {
      console.log('initRelationIM error', error);
    }
  };

  onReceiveMessage = (e: any) => {
    console.log('RECEIVE_MSG_OK msg', e);
    const rawMsg: SocketMessage = e['im-message'];
    const channelId = rawMsg.channelUuid;
    const channelObservers = this._channelMsgObservers.get(channelId);
    if (channelObservers) {
      channelObservers.forEach(cb => {
        cb(e);
      });
    } else {
      // no observer, update message unreadCount
      this.updateUnreadMsgObservers(e);
      if (rawMsg.mute) return;
      this.updateMessageCount({
        ...this._msgCount,
        unreadCount: this._msgCount.unreadCount + 1,
      });
    }
  };

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

  async refreshToken() {
    if (!this._account || !this._caHash) {
      throw new Error('no account or caHash');
    }
    const account = this._account;
    const caHash = this._caHash;
    const {
      data: { token: addressAuthToken },
    } = await this.service.verifySignatureLoop(
      () => {
        return utils.getVerifyData(account, caHash);
      },
      () => {
        return caHash === this._caHash;
      },
      5,
    );

    const {
      data: { token },
    } = await this.service.getAuthTokenLoop(
      { addressAuthToken },
      () => {
        return caHash === this._caHash;
      },
      5,
    );
    this.setAuthorization(token);
  }

  private rewriteFetch() {
    const send = this.fetchRequest.send;
    this.fetchRequest.send = async (...args) => {
      const caHash = this._caHash;
      const result = await send.apply(this.fetchRequest, args);
      if (caHash !== this._caHash) throw new Error('account changed');

      if (IM_TOKEN_ERROR_ARRAY.includes(result.code)) {
        await this.refreshToken();

        return await send.apply(this.fetchRequest, args);
      } else if (result.code?.[0] !== '2') {
        throw result;
      }
      return result;
    };
  }

  setUrl({ apiUrl, wsUrl }: { apiUrl: string; wsUrl: string }) {
    this.config.setConfig({
      requestDefaults: {
        baseURL: apiUrl,
      },
    });
    relationConfig.setSocketURL(wsUrl);
  }

  refreshMessageCount = async () => {
    const { data: messageCount } = await im.service.getUnreadCount();
    console.log('refreshMessageCount', messageCount);

    im.updateMessageCount(messageCount);
    return messageCount;
  };

  private setAuthorization(token: string) {
    this.config.setConfig({
      requestDefaults: {
        headers: {
          ...this.config.requestDefaults?.headers,
          'R-Authorization': `Bearer ${token}`,
        },
      },
    });
    request.set('headers', {
      ...request.defaultConfig.headers,
      'R-Authorization': `Bearer ${token}`,
    });
  }

  destroy() {
    console.log('destroy im', this._caHash);
    this.status = IMStatusEnum.DESTROY;
    this.setAuthorization('invalid_authorization');
    this.bindOffRelation();
    this._msgCount = {
      unreadCount: 0,
      mentionsCount: 0,
    };
    this._account = undefined;
    this._caHash = undefined;
    this.userInfo = undefined;
    this._unreadMsgObservers.clear();
    this._channelMsgObservers.clear();
    this._errorObservers.clear();
    this._msgCountObservers.clear();
    this._imInstance && this._imInstance.destroy();
    this._imInstance = undefined;
  }
}

const im = new IM();

export default im;
export { utils };
export * from './types';

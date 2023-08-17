import RelationIM, { Im, config as relationConfig } from '@relationlabs/im';
import * as utils from './utils';
import { AElfWallet } from '@portkey-wallet/types/aelf';
import { IMStatusEnum, Message, MessageCount } from './types';
import { sleep } from '@portkey-wallet/utils';
import { IIMService } from './types/service';
import { IMConfig } from './config';
import { FetchRequest } from '@portkey/request';
import { IBaseRequest } from '@portkey/types';
import { IMService } from './service';
import { getVerifyData } from './utils';
import { IM_SUCCESS_CODE, IM_TOKEN_ERROR_ARRAY } from './constant';

class IM {
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
    this._account = account;
    this._caHash = caHash;

    this.initRelationIM();
  }

  async initRelationIM() {
    if (!this._account || !this._caHash) {
      throw new Error('no account or caHash');
    }
    try {
      const caHash = this._caHash;
      const verifyData = utils.getVerifyData(`${Date.now()}`, this._account, this._caHash);
      const { data: verifyResult } = await this.service.verifySignatureLoop(verifyData);
      const addressAuthToken = verifyResult.token;
      const { data: autoResult } = await this.service.getAuthTokenLoop({
        addressAuthToken,
      });

      const token = autoResult.token;
      if (caHash !== this._caHash) {
        console.log('caHash changed');
        return;
      }
      this.config.setConfig({
        requestDefaults: {
          headers: {
            'R-Authorization': `Bearer ${token}`,
          },
        },
      });

      // TODO: remove test API_KEY
      const API_KEY = '295edaae67724a8ba04f4f39b9221779';
      this._imInstance = RelationIM.init({ token, apiKey: API_KEY, connect: true, refresh: true });
      this.listenRelationIM(this._imInstance);
      console.log('userInfo', this.userInfo);
      if (!this.userInfo) {
        // TODO: remove & add to store
        this.service.getUserInfo().then(result => {
          console.log('getUserInfo', result.data);
          this.userInfo = result.data;
        });
      }
    } catch (error) {
      console.log('init error', error);
    }
  }

  listenRelationIM(imInstance: RelationIM) {
    imInstance.bind(Im.CONNECT_OK, () => {
      console.log('CONNECT_OK');
    });

    imInstance.bind(Im.CONNECT_ERR, (e: any) => {
      console.log('CONNECT_ERR msg', e);
    });
    imInstance.bind(Im.CONNECT_CLOSE, async (e: any) => {
      console.log('CONNECT_CLOSE msg', e);
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

  private rewriteFetch() {
    const send = this.fetchRequest.send;
    this.fetchRequest.send = async (...args) => {
      const result = await send.apply(this.fetchRequest, args);

      if (IM_TOKEN_ERROR_ARRAY.includes(result.code)) {
        if (!this._account || !this._caHash) {
          throw new Error('no account or caHash');
        }
        try {
          const caHash = this._caHash;
          const verifyData = getVerifyData(`${Date.now()}`, this._account, this._caHash);
          const {
            data: { token: addressAuthToken },
          } = await this.service.verifySignatureLoop(verifyData, 5);
          const {
            data: { token },
          } = await this.service.getAuthTokenLoop({ addressAuthToken }, 5);

          if (caHash !== this._caHash) {
            throw new Error('account changed');
          }
          this.config.setConfig({
            requestDefaults: {
              headers: {
                'R-Authorization': `Bearer ${token}`,
              },
            },
          });
          return await send.apply(this.fetchRequest, args);
        } catch (error) {
          throw error;
        }
      } else if (result.code !== IM_SUCCESS_CODE) {
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

  destroy() {
    this._imInstance && this._imInstance.destroy();
    this._imInstance = undefined;
    this._msgCount = {
      unreadCount: 0,
      mentionsCount: 0,
    };
    this._account = undefined;
    this._caHash = undefined;
    this.status = IMStatusEnum.INIT;
    this.userInfo = undefined;
    this._unreadMsgObservers.clear();
    this._channelMsgObservers.clear();
    this._errorObservers.clear();
    this._msgCountObservers.clear();
  }
}

const im = new IM();

export default im;
export { utils };
export * from './types';

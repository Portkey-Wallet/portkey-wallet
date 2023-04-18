import PortKeyAelfProvider from './PortKeyAelfProvider';
import CrossChainProvider from './CrossChainProvider';
import BaseProvider, { BaseProviderOptions } from './BaseProvider';
import EncryptedStream from 'utils/EncryptedStream';
import { MethodMessageTypes, NOTIFICATION_NAMES } from 'messages/InternalMessageTypes';
import errorHandler from 'utils/errorHandler';

let stream: EncryptedStream | undefined;

interface PortKeyProviderOptions extends BaseProviderOptions {
  stream?: EncryptedStream;
}

export default class PortKeyProvider extends BaseProvider {
  public AElf: any;
  public CrossChain: any;
  public chainId?: string | number;
  public httpProvider?: string[];
  // public stream: EncryptedStream | undefined;

  constructor(props: PortKeyProviderOptions) {
    super(props);
    this.AElf = PortKeyAelfProvider;
    this.CrossChain = CrossChainProvider;
    this.request = this.request.bind(this);
    stream = props.stream;
    this.streamListener();
    this.isConnected = this.isConnected.bind(this);
    this._getDefaultState();
  }

  private async _getDefaultState() {
    const result = await this.request({
      method: MethodMessageTypes.GET_WALLET_STATE,
    });
    if (result?.data && result?.data?.chain) {
      this.chainId = result.data.chain?.chainId;
      this.httpProvider = [result.data.chain?.rpcUrl];
      super._handleConnect(result.data.chain);
    }
  }

  protected streamListener() {
    stream?.addEventListener((result) => {
      switch (result?.method) {
        case NOTIFICATION_NAMES.CHAIN_CHANGED:
          super._handleChainChanged(result.data);
          break;
        case NOTIFICATION_NAMES.ACCOUNTS_CHANGED:
          super._handleAccountsChanged(result.data);
          break;
        case NOTIFICATION_NAMES.UNLOCK_STATE_CHANGED:
          super._handleUnlockStateChanged(result.data);
          break;
        case NOTIFICATION_NAMES.DISCONNECT:
          super._handleDisconnect(result.data);
          break;
        default:
          super._handlePendingPromise(result);
          break;
      }
    });
  }

  request(args: RequestArguments): Promise<any> {
    if (!stream) throw errorHandler(200015);
    return super._request(stream, args);
  }

  /**
   * Returns whether the provider can process RPC requests.
   */
  isConnected(): boolean {
    return super.isConnected();
  }
}

import { IEBridgeChainInfo, TokenInfo } from './types';
import { getChainIdByMap } from './utils';
import { IBridgeOperator, ICreateReceiptParams, IEBridge } from './types/bridge';
import { ELFBridgeOperator, EVMBridgeOperator } from './utils/operator';
import { AElfWallet } from '@portkey-wallet/types/aelf';

export type TEBridgeOptions = {
  wallet?: AElfWallet;
  fromChainInfo: IEBridgeChainInfo;
  toChainInfo: IEBridgeChainInfo;
  tokenInfo: { [chainId: string | number]: TokenInfo };
};

export class EBridge implements IEBridge {
  public fromOperator: IBridgeOperator;
  public toOperator: IBridgeOperator;
  public options: TEBridgeOptions;
  constructor(options: TEBridgeOptions) {
    console.log('EBridge chainInfo ===', options.fromChainInfo);
    this.options = options;
    this.fromOperator =
      options.fromChainInfo.chainType === 'aelf'
        ? new ELFBridgeOperator(options.fromChainInfo, options?.wallet)
        : new EVMBridgeOperator(options.fromChainInfo);
    this.toOperator =
      options.toChainInfo.chainType === 'aelf'
        ? new ELFBridgeOperator(options.toChainInfo)
        : new EVMBridgeOperator(options.toChainInfo);
  }

  getLimit = async () => {
    const fromTokenInfo = this.options.tokenInfo[this.options.fromChainInfo.chainId];
    const toBridgeChainId = getChainIdByMap(this.options.toChainInfo.chainId);
    const fromLimit = await this.fromOperator.getFromLimit(
      toBridgeChainId,
      this.options.fromChainInfo.chainType == 'aelf' ? fromTokenInfo.symbol : fromTokenInfo.address,
    );
    return fromLimit;
  };

  getELFFee = async () => {
    const toBridgeChainId = getChainIdByMap(this.options.toChainInfo.chainId);
    if (this.fromOperator instanceof ELFBridgeOperator) {
      return this.fromOperator.getELFFee(toBridgeChainId);
    } else {
      return '0';
    }
  };

  createReceipt(params: ICreateReceiptParams): Promise<any> {
    const fromTokenInfo = this.options.tokenInfo[this.options.fromChainInfo.chainId];

    return this.fromOperator.createReceipt({
      ...params,
      tokenInfo: fromTokenInfo,
      targetChainId: this.options.toChainInfo.chainId,
    });
  }
}

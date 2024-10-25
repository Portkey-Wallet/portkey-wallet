import { IEBridgeChainInfo, TokenInfo } from './types';
import { IBridgeOperator, IEBridge } from './types/bridge';
import { ELFBridgeOperator, EVMBridgeOperator } from './utils/operator';

export type TEBridgeOptions = {
  fromChainInfo: IEBridgeChainInfo;
  toChainInfo: IEBridgeChainInfo;
  tokenInfo: { [chainId: string | number]: TokenInfo };
};

export class EBridge implements IEBridge {
  public fromOperator: IBridgeOperator;
  public toOperator: IBridgeOperator;
  public options: TEBridgeOptions;
  constructor(options: TEBridgeOptions) {
    this.options = options;
    this.fromOperator =
      options.fromChainInfo.chainType === 'aelf'
        ? new ELFBridgeOperator(options.fromChainInfo)
        : new EVMBridgeOperator(options.fromChainInfo);
    this.toOperator =
      options.toChainInfo.chainType === 'aelf'
        ? new ELFBridgeOperator(options.toChainInfo)
        : new EVMBridgeOperator(options.toChainInfo);
  }

  getLimit = async () => {
    const fromTokenInfo = this.options.tokenInfo[this.options.fromChainInfo.chainId];
    const fromLimit = await this.fromOperator.getFromLimit(
      this.options.toChainInfo.contractChainId as any,
      this.options.fromChainInfo.chainType == 'aelf' ? fromTokenInfo.symbol : fromTokenInfo.address,
    );
    return fromLimit;
  };

  getELFFee = async () => {
    console.log(this.options.toChainInfo.contractChainId, '===this.options.toChainInfo.contractChainId');
    if (this.fromOperator instanceof ELFBridgeOperator) {
      return this.fromOperator.getELFFee(this.options.toChainInfo.contractChainId);
    } else {
      return '0';
    }
  };

  createReceipt = (amount: string, targetAddress: string) => {
    // this.fromOperator.
    // CreateReceipt
    /**
     * message CreateReceiptInput{
    string symbol = 1;
    aelf.Address owner = 2; //sender
    string targetAddress = 3;// evm address
    int64 amount = 4;
    string target_chain_id = 5; //ex. Ethereum BSC BaseSepolia
}
     */

    if (this.options.tokenInfo[this.options.fromChainInfo.chainId].symbol === 'ELF') {
      // allowance ELFFee + amount
      // approve ELF
    } else {
      // allowance
      // approve ELF
      // approve c symbol
    }
    throw new Error('Method not implemented.');
  };
}

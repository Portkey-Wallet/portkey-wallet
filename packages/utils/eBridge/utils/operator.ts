import { getContractBasic } from '@portkey/contracts';
import { aelf } from '@portkey/utils';
import { IEBridgeELFChainInfo, IEBridgeEVMChainInfo } from '../types';
import { VIEW_PRIVATE } from '../constants';
import { getEVMContract, getHttpProvider } from '../utils/evm';
import { BRIDGE_IN_ABI } from '../abis';
import { IBridgeOperator } from '../types/bridge';
import { LIMIT_ABI } from '../abis';
import { WB3ContractBasic } from '../utils/web3Contract';
import Web3 from 'web3';
import { ChainId, IContract } from '@portkey/types';
import { getReceiptLimit } from '../utils';

export class EVMBridgeOperator implements IBridgeOperator {
  public chainInfo: IEBridgeEVMChainInfo;
  constructor(chainInfo: IEBridgeEVMChainInfo) {
    this.chainInfo = chainInfo;
  }
  public getBridgeContract = () => {
    const contract = getEVMContract(this.chainInfo.rpcUrl, BRIDGE_IN_ABI as any, this.chainInfo.bridgeContract);
    const web3 = new Web3(getHttpProvider(this.chainInfo.rpcUrl));
    return new WB3ContractBasic({ web3, contract });
  };
  public getLimitOutContract = () => {
    const contract = getEVMContract(this.chainInfo.rpcUrl, LIMIT_ABI as any, this.chainInfo.limitContract);
    const web3 = new Web3(getHttpProvider(this.chainInfo.rpcUrl));
    return new WB3ContractBasic({ web3, contract });
  };

  getFromLimit = async (toChainId: string, target: string) => {
    const limitContract = this.getLimitOutContract();
    const limit = await getReceiptLimit({
      type: 'evm',
      limitContract: limitContract as unknown as IContract,
      target,
      toChainId: toChainId as ChainId,
    });
    return limit;
  };
  getToLimit = async (toChainId: string, target: string) => {
    const limitContract = this.getLimitOutContract();
    const limit = await getReceiptLimit({
      type: 'evm',
      limitContract: limitContract as unknown as IContract,
      target,
      toChainId: toChainId as ChainId,
    });
    return limit;
  };
}

export class ELFBridgeOperator implements IBridgeOperator {
  public chainInfo: IEBridgeELFChainInfo;
  constructor(chainInfo: IEBridgeELFChainInfo) {
    this.chainInfo = chainInfo;
  }
  public getBridgeContract = () => {
    return getContractBasic({
      account: aelf.getWallet(VIEW_PRIVATE),
      rpcUrl: this.chainInfo.rpcUrl,
      contractAddress: this.chainInfo.bridgeContract,
    });
  };

  getFromLimit = async (toChainId: string, target: string) => {
    const bridgeContract = await this.getBridgeContract();
    const limit = await getReceiptLimit({
      type: 'aelf',
      limitContract: bridgeContract as unknown as IContract,
      target,
      toChainId: toChainId as ChainId,
    });
    return limit;
  };

  getELFFee = async (toChainId: string) => {
    const bridgeContract = await this.getBridgeContract();
    const ELFFee = await bridgeContract.callViewMethod('GetFeeByChainId', {
      value: toChainId,
    });
    return ELFFee.data.value;
  };
  getToLimit = async (toChainId: string, target: string) => {
    const bridgeContract = await this.getBridgeContract();
    const limit = await getReceiptLimit({
      type: 'aelf',
      limitContract: bridgeContract as unknown as IContract,
      target,
      toChainId: toChainId as ChainId,
    });
    return limit;
  };
}

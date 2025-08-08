import { getContractBasic } from '@portkey/contracts';
import { aelf } from '@portkey/utils';
import { IEBridgeELFChainInfo, IEBridgeEVMChainInfo } from '../types';
import { VIEW_PRIVATE } from '../constants';
import { getEVMContract, getHttpProvider } from '../utils/evm';
import { BRIDGE_IN_ABI } from '../abis';
import { IBridgeOperator, ICheckAndApproveParams, ICreateReceiptHandlerParams } from '../types/bridge';
import { LIMIT_ABI } from '../abis';
import { WB3ContractBasic } from '../utils/web3Contract';
import Web3 from 'web3';
import { ChainId, IContract } from '@portkey/types';
import { getChainIdByMap, getReceiptLimit } from '../utils';
import type { Contract } from 'web3-eth-contract';
import { ZERO } from '@portkey-wallet/constants/misc';
import { divDecimals, timesDecimals } from '../../converter';
import { AElfWallet } from '@portkey-wallet/types/aelf';

export const ELF_NATIVE_TOKEN = 'ELF';

export class EVMBridgeOperator implements IBridgeOperator {
  public chainInfo: IEBridgeEVMChainInfo;
  constructor(chainInfo: IEBridgeEVMChainInfo) {
    this.chainInfo = chainInfo;
  }
  checkAllowanceAndApprove(_: ICheckAndApproveParams): Promise<boolean> {
    throw new Error('Method not implemented.');
  }
  createReceipt(_: ICreateReceiptHandlerParams): Promise<any> {
    throw new Error('Method not implemented.');
  }

  public getBridgeContract = () => {
    const contract = getEVMContract(this.chainInfo.rpcUrl, BRIDGE_IN_ABI as any, this.chainInfo.bridgeContract);
    const web3 = new Web3(getHttpProvider(this.chainInfo.rpcUrl));
    return new WB3ContractBasic({ web3, contract: contract as unknown as Contract });
  };
  public getLimitOutContract = () => {
    const contract = getEVMContract(this.chainInfo.rpcUrl, LIMIT_ABI as any, this.chainInfo.limitContract);
    const web3 = new Web3(getHttpProvider(this.chainInfo.rpcUrl));
    return new WB3ContractBasic({ web3, contract: contract as unknown as Contract });
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
  private wallet: AElfWallet | undefined;

  constructor(chainInfo: IEBridgeELFChainInfo, wallet?: AElfWallet) {
    this.chainInfo = chainInfo;
    this.wallet = wallet;
  }

  public getBridgeContract = () => {
    console.log('getBridgeContract params', {
      account: this.wallet,
      rpcUrl: this.chainInfo.rpcUrl,
      contractAddress: this.chainInfo.bridgeContract,
    });

    return getContractBasic({
      account: this.wallet || aelf.getWallet(VIEW_PRIVATE),
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
    console.log('getELFFee1111');

    const bridgeContract = await this.getBridgeContract();
    console.log('getELFFee2222');
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

  checkAllowanceAndApprove = async ({ tokenContract, symbol, spender, owner, amount }: ICheckAndApproveParams) => {
    const [allowance, info] = await Promise.all([
      tokenContract.callViewMethod('GetAllowance', { symbol, owner, spender }),
      tokenContract.callViewMethod('GetTokenInfo', { symbol }),
    ]);
    if (allowance?.error) throw allowance?.error;
    if (info?.error) throw info?.error;

    console.log('checkAllowanceAndApprove---- ', symbol, allowance, amount);

    const allowanceBN = ZERO.plus(allowance.data.allowance ?? allowance.data.amount ?? 0);
    const pivotBalanceBN = timesDecimals(amount, info.data.decimals ?? 8);

    if (allowanceBN.lt(pivotBalanceBN)) {
      console.log('checkAllowanceAndApprove3333', owner, [spender, symbol, pivotBalanceBN.toFixed()]);

      const approveResult = await tokenContract.callSendMethod('approve', owner, {
        spender,
        symbol,
        amount: pivotBalanceBN.toFixed(),
      });

      if (approveResult?.error) throw approveResult?.error;

      return true;
    }

    return true;
  };

  async createReceipt(params: ICreateReceiptHandlerParams): Promise<any> {
    const { amount, tokenContract, account, owner, tokenInfo, targetChainId, targetAddress } = params;
    const symbol = tokenInfo.symbol;
    const approveParams = {
      tokenContract,
      symbol,
      spender: this.chainInfo.bridgeContract,
      owner,
      amount,
    };
    const toBridgeChainId = getChainIdByMap(String(targetChainId));

    const ELFFee = await this.getELFFee(toBridgeChainId);
    const ELFFeeAmount = divDecimals(ELFFee, 8).toFixed(0);

    if (symbol === ELF_NATIVE_TOKEN) {
      approveParams.amount = ZERO.plus(amount).plus(ELFFeeAmount).toFixed(0);
      approveParams.symbol = tokenInfo.symbol;
    }

    const bridgeContract = await this.getBridgeContract();

    console.log('callSendMethod CreateReceipt', [
      symbol,
      account,
      targetAddress,
      amount,
      getChainIdByMap(targetChainId),
      0,
    ]);

    if (symbol !== ELF_NATIVE_TOKEN) {
      await this.checkAllowanceAndApprove({
        ...approveParams,
        spender: this.chainInfo.bridgeContract,
        owner: account,
        amount: ELFFeeAmount,
        symbol: ELF_NATIVE_TOKEN,
      });
    }

    if (symbol === ELF_NATIVE_TOKEN) {
      approveParams.amount = ZERO.plus(amount).plus(ELFFeeAmount).toFixed(0);
      approveParams.symbol = tokenInfo.symbol;
    }

    const approveResult = await this.checkAllowanceAndApprove({
      ...approveParams,
      spender: this.chainInfo.bridgeContract,
      owner: account,
    });
    console.log('approveResult==', approveResult);

    console.log('======CreateReceipt params', account || '', {
      symbol,
      owner,
      targetAddress,
      amount: timesDecimals(amount, tokenInfo.decimals ?? 8).toFixed(0),
      targetChainId: getChainIdByMap(targetChainId),
    });

    return bridgeContract.callSendMethod('CreateReceipt', account || '', {
      symbol,
      owner,
      targetAddress,
      amount: timesDecimals(amount, tokenInfo.decimals ?? 8).toFixed(0),
      targetChainId: getChainIdByMap(targetChainId),
    });

    // return portkeyContract.callSendMethod('ManagerForwardCall', '', {
    //   caHash,
    //   contractAddress: this.chainInfo.bridgeContract,
    //   methodName: 'CreateReceipt',
    //   args: {
    //     symbol,
    //     owner,
    //     targetAddress,
    //     amount: timesDecimals(amount, tokenInfo.decimals ?? 8).toFixed(0),
    //     targetChainId: getChainIdByMap(targetChainId),
    //   },
    // });
  }
}

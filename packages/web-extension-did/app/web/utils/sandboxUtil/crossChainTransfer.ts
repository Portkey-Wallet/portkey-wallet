import { ChainItemType } from '@portkey-wallet/store/store-ca/wallet/type';
import { ChainType } from '@portkey-wallet/types';
import { BaseToken } from '@portkey-wallet/types/types-ca/token';
import { getChainIdByAddress } from '@portkey-wallet/utils';
import { crossChainTransferToCa } from './crossChainTransferToCa';
import { managerTransfer } from './managerTransfer';
import { getChainNumber } from '@portkey-wallet/utils/aelf';
import { ZERO } from '@portkey-wallet/constants/misc';
import { CROSS_FEE } from '@portkey-wallet/constants/constants-ca/wallet';
import { timesDecimals } from '@portkey-wallet/utils/converter';
import { the2ThFailedActivityItemType } from '@portkey-wallet/types/types-ca/activity';

const nativeToken = {
  symbol: 'ELF',
  decimals: 8,
};

export type CrossChainTransferIntervalParams = Omit<CrossChainTransferParams, 'caHash' | 'fee'>;

export const intervalCrossChainTransfer = async (params: CrossChainTransferIntervalParams, count = 0) => {
  const { chainInfo, chainType, privateKey, managerAddress, amount, tokenInfo, memo = '', toAddress } = params;
  const issueChainId = getChainIdByAddress(managerAddress, chainType);
  const toChainId = getChainIdByAddress(toAddress, chainType);
  console.log('error===sendHandler--intervalCrossChainTransfer------', params);
  try {
    const a = await crossChainTransferToCa({
      rpcUrl: chainInfo.endPoint,
      address: tokenInfo.address,
      chainType,
      privateKey,
      paramsOption: {
        issueChainId: getChainNumber(issueChainId),
        toChainId: getChainNumber(toChainId),
        symbol: tokenInfo.symbol,
        to: toAddress,
        amount,
        memo,
      },
    });
    console.log(a, 'getBalance');
  } catch (error) {
    console.log(error, 'error===sendHandler--intervalCrossChainTransfer');
    count++;
    if (count > 5) throw error;
    await intervalCrossChainTransfer(params, count);
  }
};

interface CrossChainTransferParams {
  chainInfo: ChainItemType;
  chainType: ChainType;
  privateKey: string;
  managerAddress: string;
  tokenInfo: BaseToken;
  caHash: string;
  amount: number;
  toAddress: string;
  memo?: string;
  fee: number;
}
const crossChainTransfer = async ({
  chainInfo,
  chainType,
  privateKey,
  managerAddress,
  caHash,
  amount,
  tokenInfo,
  memo = '',
  toAddress,
}: CrossChainTransferParams) => {
  let managerTransferResult;
  try {
    // let _amount = amount;
    // if (tokenInfo.symbol === nativeToken.symbol) {
    //   //
    //   _amount = ZERO.plus(amount).plus(fee).toNumber();
    // } else {
    //   await managerTransfer({
    //     rpcUrl: chainInfo.endPoint,
    //     address: chainInfo.caContractAddress,
    //     chainType,
    //     privateKey,
    //     paramsOption: {
    //       caHash,
    //       symbol: 'ELF',
    //       to: managerAddress,
    //       amount: fee,
    //       memo,
    //     },
    //   });
    // }
    // first transaction:transfer to manager itself
    managerTransferResult = await managerTransfer({
      rpcUrl: chainInfo.endPoint,
      address: chainInfo.caContractAddress,
      chainType,
      privateKey,
      paramsOption: {
        caHash,
        symbol: tokenInfo.symbol,
        to: managerAddress,
        amount: amount,
        memo,
      },
    });
  } catch (error) {
    throw {
      type: 'managerTransfer',
      error: error,
    };
  }
  console.log(managerAddress, 'managerAddress===');

  // second transaction:crossChain transfer to toAddress

  // return;
  // TODO Only support chainType: aelf
  let _amount = amount;
  if (tokenInfo.symbol === nativeToken.symbol) {
    _amount = ZERO.plus(amount).minus(timesDecimals(CROSS_FEE, 8)).toNumber();
  }
  const crossChainTransferParams = {
    chainInfo,
    chainType,
    privateKey,
    managerAddress,
    amount: _amount,
    tokenInfo,
    memo,
    toAddress,
  };
  try {
    await intervalCrossChainTransfer(crossChainTransferParams);
  } catch (error) {
    const returnData: the2ThFailedActivityItemType = {
      transactionId: managerTransferResult.result.message.TransactionId,
      params: {
        tokenInfo,
        chainType,
        managerAddress,
        amount: _amount,
        memo,
        toAddress,
      },
    };
    throw {
      type: 'crossChainTransfer',
      error: error,
      managerTransferTxId: managerTransferResult.result.message.TransactionId,
      data: returnData,
    };
  }
};

export default crossChainTransfer;

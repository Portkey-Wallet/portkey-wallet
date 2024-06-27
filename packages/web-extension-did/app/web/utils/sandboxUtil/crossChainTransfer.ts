import { ChainType } from '@portkey-wallet/types';
import { BaseToken } from '@portkey-wallet/types/types-ca/token';
import { getChainIdByAddress } from '@portkey-wallet/utils';
import { crossChainTransferToCa } from './crossChainTransferToCa';
import { getChainNumber } from '@portkey-wallet/utils/aelf';
import { ZERO } from '@portkey-wallet/constants/misc';
import { timesDecimals } from '@portkey-wallet/utils/converter';
import { the2ThFailedActivityItemType } from '@portkey-wallet/types/types-ca/activity';
import { getTxFee } from 'store/utils/getStore';
import { DEFAULT_TOKEN } from '@portkey-wallet/constants/constants-ca/wallet';
import { getTokenInfo } from './getTokenInfo';
import { GuardianItem } from 'types/guardians';
import { managerForwardCall } from './managerForwardCall';
import { IChainItemType } from '@portkey-wallet/types/types-ca/chain';

export type CrossChainTransferIntervalParams = Omit<CrossChainTransferParams, 'caHash' | 'fee'> & {
  issueChainId: number;
};

export const intervalCrossChainTransfer = async (params: CrossChainTransferIntervalParams, count = 0) => {
  const { chainInfo, chainType, privateKey, issueChainId, amount, tokenInfo, memo = '', toAddress } = params;
  const toChainId = getChainIdByAddress(toAddress, chainType);
  let _issueChainId = issueChainId;
  if (!_issueChainId) {
    _issueChainId = await getTokenInfo({
      rpcUrl: chainInfo.endPoint,
      address: tokenInfo.address,
      chainType,
      paramsOption: {
        symbol: tokenInfo.symbol,
      },
    });
  }

  try {
    const result = await crossChainTransferToCa({
      rpcUrl: chainInfo.endPoint,
      address: tokenInfo.address,
      chainType,
      privateKey,
      paramsOption: {
        issueChainId: _issueChainId,
        toChainId: getChainNumber(toChainId),
        symbol: tokenInfo.symbol,
        to: toAddress,
        amount,
        memo,
      },
    });
    console.log(result, 'crossChainTransferToCa');
  } catch (error) {
    console.log(error, 'error===sendHandler--intervalCrossChainTransfer');
    count++;
    if (count > 5) throw error;
    await intervalCrossChainTransfer(params, count);
  }
};

interface CrossChainTransferParams {
  chainInfo: IChainItemType;
  chainType: ChainType;
  privateKey: string;
  managerAddress: string;
  tokenInfo: BaseToken;
  caHash: string;
  amount: number | string;
  toAddress: string;
  memo?: string;
  fee: number | string;
  guardiansApproved?: GuardianItem[];
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
  guardiansApproved,
}: CrossChainTransferParams) => {
  let managerTransferResult;
  const issueChainId = await getTokenInfo({
    rpcUrl: chainInfo.endPoint,
    address: tokenInfo.address,
    chainType,
    paramsOption: {
      symbol: tokenInfo.symbol,
    },
  });

  console.log(issueChainId, 'issueChainId===');

  if (typeof issueChainId !== 'number') throw Error('GetTokenInfo Error');
  try {
    // first transaction:transfer to manager itself
    managerTransferResult = await managerForwardCall({
      rpcUrl: chainInfo.endPoint,
      address: chainInfo.caContractAddress,
      chainType,
      privateKey,
      paramsOption: {
        caHash,
        contractAddress: tokenInfo.address,
        methodName: 'Transfer',
        args: {
          symbol: tokenInfo.symbol,
          to: managerAddress,
          amount,
          memo,
        },
        guardiansApproved,
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
  const { crossChain: crossChainFee } = getTxFee(tokenInfo.chainId);
  if (tokenInfo.symbol === DEFAULT_TOKEN.symbol) {
    _amount = ZERO.plus(amount).minus(timesDecimals(crossChainFee, DEFAULT_TOKEN.decimals)).toNumber();
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
    issueChainId,
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
        issueChainId,
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

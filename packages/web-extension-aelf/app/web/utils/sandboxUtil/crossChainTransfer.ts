import { ChainType } from '@portkey-wallet/types';
import { BaseToken } from '@portkey-wallet/types/types-eoa/token';
import { getChainIdByAddress } from '@portkey-wallet/utils';
import { crossChainTransferToCa } from './crossChainTransferToCa';
import { getChainNumber } from '@portkey-wallet/utils/aelf';
import { getTokenInfo } from './getTokenInfo';
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
  tokenInfo: BaseToken;
  amount: number | string;
  toAddress: string;
  memo?: string;
}
const crossChainTransfer = async ({
  chainInfo,
  chainType,
  privateKey,
  amount,
  tokenInfo,
  memo = '',
  toAddress,
}: CrossChainTransferParams) => {
  const issueChainId = await getTokenInfo({
    rpcUrl: chainInfo.endPoint,
    address: tokenInfo.address,
    chainType,
    paramsOption: {
      symbol: tokenInfo.symbol,
    },
  });

  if (typeof issueChainId !== 'number') throw Error('GetTokenInfo Error');

  // second transaction:crossChain transfer to toAddress

  // TODO Only support chainType: aelf
  const toChainId = getChainIdByAddress(toAddress, chainType);
  return crossChainTransferToCa({
    rpcUrl: chainInfo.endPoint,
    address: tokenInfo.address,
    chainType,
    privateKey,
    paramsOption: {
      issueChainId: issueChainId,
      toChainId: getChainNumber(toChainId),
      symbol: tokenInfo.symbol,
      to: toAddress,
      amount,
      memo,
    },
  });
};

export default crossChainTransfer;

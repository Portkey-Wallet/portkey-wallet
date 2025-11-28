import { ChainType } from '@portkey-wallet/types';
import { BaseToken } from '@portkey-wallet/types/types-eoa/token';
import { IChainItemType } from '@portkey-wallet/types/types-ca/chain';
import { callContract } from './callContract';

const sameChainTransfer = async ({
  chainInfo,
  chainType,
  privateKey,
  amount,
  tokenInfo,
  memo = '',
  toAddress: to,
}: {
  chainInfo: IChainItemType;
  chainType: ChainType;
  privateKey: string;
  tokenInfo: BaseToken;
  amount: number | string;
  toAddress: string;
  memo?: string;
}) => {
  return callContract({
    rpcUrl: chainInfo.endPoint,
    chainType,
    address: chainInfo.defaultToken.address,
    privateKey,
    methodName: 'Transfer',
    paramsOption: {
      symbol: tokenInfo.symbol,
      to,
      amount,
      memo,
    },
  });
};

export default sameChainTransfer;

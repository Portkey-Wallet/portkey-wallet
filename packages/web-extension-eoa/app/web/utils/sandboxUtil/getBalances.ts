import { ChainType } from '@portkey-wallet/types';
import { IChainItemType } from '@portkey-wallet/types/types-ca/chain';
import { BaseToken } from '@portkey-wallet/types/types-ca/token';
import SandboxEventTypes from 'messages/SandboxEventTypes';
import SandboxEventService, { SandboxErrorCode } from 'service/SandboxEventService';

export const getBalance = async ({
  account,
  currentChain,
  tokenList,
  chainType,
}: {
  account: string;
  tokenList: BaseToken[];
  currentChain: IChainItemType;
  chainType: ChainType;
}) => {
  if (!account) return;
  const balanceMessage = await SandboxEventService.dispatchAndReceive(SandboxEventTypes.getBalances, {
    tokens: tokenList,
    rpcUrl: currentChain.endPoint,
    account,
    chainType,
  });
  if (balanceMessage.code === SandboxErrorCode.error) return balanceMessage.error;
  const balance = balanceMessage.message;
  const balances = tokenList.map((item, index) => ({
    symbol: item.symbol,
    balance: balance[index],
  }));
  return {
    code: balanceMessage.code,
    result: {
      rpcUrl: currentChain.endPoint,
      account,
      balances,
    },
  };
};

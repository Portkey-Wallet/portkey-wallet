import { ChainId } from '@portkey-wallet/types';
import { stringifyUrl } from 'query-string';

type ETransType = 'Deposit' | 'Withdraw';

type StringifyETransParams = {
  type?: ETransType;
  chainId?: ChainId;
  tokenSymbol?: string;
  withdrawAddress?: string;
};

export function stringifyETrans(params: { url: string; query?: StringifyETransParams }) {
  return stringifyUrl(params);
}

import { request } from '@portkey-wallet/api/api-did';
import { ZERO } from '@portkey-wallet/constants/misc';
import { ChainId } from '@portkey-wallet/types';

export interface IGetSendNetworkListParams {
  symbol: string;
  chainId: ChainId;
  toAddress: string;
}

export function getSendNetworkList(params: IGetSendNetworkListParams) {
  return request.sendApi.getSendNetworkList({
    params,
  });
}

export function getSmallerValue(v1: string, v2: string) {
  if (!v1 || !v2) throw 'invalid value';
  return ZERO.plus(v1).isGreaterThan(v2) ? v2 : v1;
}

export function getLimitTips(symbol: string, from: string, to: string) {
  return `Transfer limit: ${from} to ${to} ${symbol}`;
}

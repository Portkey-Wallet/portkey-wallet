import { request } from '@portkey-wallet/api/api-did';
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

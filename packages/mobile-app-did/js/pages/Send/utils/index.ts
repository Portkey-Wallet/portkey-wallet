import { request } from '@portkey-wallet/api/api-did';
import { ZERO } from '@portkey-wallet/constants/misc';
import { ChainId } from '@portkey-wallet/types';
import { Linking } from 'react-native';
import { INetworkItem } from '../components/SelectNetwork';
import { TransferType } from '@portkey-wallet/types/types-ca/routeParams';

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

export async function openOutLink(url: string) {
  try {
    await Linking.openURL(url);
  } catch (error) {
    console.log('open error');
  }
}

export function getSmallerValue(v1: string, v2: string) {
  if (!v1 || !v2) throw 'invalid value';
  return ZERO.plus(v1).isGreaterThan(v2) ? v2 : v1;
}

export function getLimitTips(symbol: string, from: string, to: string) {
  return `Transfer limit: ${from} to ${to} ${symbol}`;
}

export const getEstimatedTime = (targetNetwork: INetworkItem, transferType: TransferType) => {
  const transferItem = targetNetwork?.serviceList?.find(ele =>
    ele?.serviceName?.toLocaleLowerCase()?.includes('transfer'),
  );
  const bridgeItem = targetNetwork?.serviceList?.find(ele => ele?.serviceName?.toLocaleLowerCase()?.includes('bridge'));

  if (transferType === TransferType.E_TRANSFER) return transferItem?.multiConfirmTime;
  if (transferType === TransferType.E_BRIDGE) return bridgeItem?.multiConfirmTime;
  return '';
};

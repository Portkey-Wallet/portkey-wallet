import { INetworkItem } from 'pages/Send/components/SelectNetwork';
import { ChainId, ChainType } from '..';
import { SeedTypeEnum } from './assets';
import { GuardiansApprovedType } from './guardian';
import type { SendType } from './send';

export interface IToSendHomeAssetParamsBaseType {
  symbol: string;
  label?: string;
  chainId: ChainId;
  balance: string;
  imageUrl: string;
  tokenContractAddress: string;
  address?: string;
  [key: string]: any;
}

export interface IToSendTokenParamsType extends IToSendHomeAssetParamsBaseType {
  balanceInUsd: string;
  decimals: string;
}

export interface IToSendNftParamsType extends IToSendHomeAssetParamsBaseType {
  alias: string;
  tokenId: string;
  decimals: string;
  isSeed?: boolean;
  seedType?: SeedTypeEnum;
}

export type IToSendAssetParamsType = IToSendTokenParamsType | IToSendNftParamsType;

export type ImTransferInfoType = {
  isGroupChat?: boolean;
  channelId?: string;
  toUserId?: string;
  name?: string;
  addresses?: { address: string; chainId: ChainId; chainName?: string }[];
};

export interface TToInfo {
  name: string;
  address: string;
  network: string;
  chainId?: ChainId;
  chainType?: ChainType;
}

export interface IToSendHomeParamsType {
  sendType: SendType;
  toInfo: TToInfo;
  assetInfo: IToSendAssetParamsType;
  imTransferInfo?: ImTransferInfoType;
}

export enum TransferType {
  'GENERAL_SAME_CHAIN' = 'generalSameChain',
  'GENERAL_CROSS_CHAIN' = 'generalCrossChain',
  'E_BRIDGE' = 'eBridge',
  'E_TRANSFER' = 'eTransfer',
}
export interface IToSendPreviewParamsType extends IToSendHomeParamsType {
  sendNumber: string | number;
  successNavigateName?: any;
  guardiansApproved?: GuardiansApprovedType[];
  isAutoSend?: boolean;
  transactionFee?: string | number;
  transactionFeeUnit?: string | number;
  networkFee?: string | number;
  networkFeeUnit?: string | number;
  receiveAmount?: string;
  receiveAmountUsd?: string;
  crossChainFee: number | string;
  crossChainFeeUnit?: string;
  transferType: TransferType;
  targetNetwork: INetworkItem;
}

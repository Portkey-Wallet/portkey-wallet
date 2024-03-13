import { ChainId, ChainType } from '..';
import type { SendType } from './send';
import { LoginType } from './wallet';

export interface IToSendHomeAssetParamsBaseType {
  symbol: string;
  chainId: ChainId;
  balance: string;
  imageUrl: string;
  tokenContractAddress: string;
  [key: string]: any;
}

export interface IToSendTokenParamsType extends IToSendHomeAssetParamsBaseType {
  balanceInUsd: string;
  decimals: string;
}

export interface IToSendNftParamsType extends IToSendHomeAssetParamsBaseType {
  alias: string;
  tokenId: string;
}

export type IToSendAssetParamsType = IToSendTokenParamsType | IToSendNftParamsType;

export interface IToSendHomeParamsType {
  sendType: SendType;
  toInfo?: {
    address: string;
    name: string;
    chainId?: ChainId;
    chainType?: ChainType;
  };
  assetInfo: IToSendAssetParamsType;
}

export interface IToSendPreviewParamsType extends IToSendHomeParamsType {
  transactionFee: string | number;
  sendNumber: string | number;
  successNavigateName?: any;
  guardiansApproved?: GuardiansApprovedType[];
  isAutoSend?: boolean;
}

export type GuardiansApprovedType = {
  identifierHash: string;
  type: LoginType;
  verificationInfo: {
    id: string | undefined;
    signature: number[];
    verificationDoc: string;
  };
};

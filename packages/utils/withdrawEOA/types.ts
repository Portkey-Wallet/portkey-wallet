import { CurrentWalletType } from '@portkey-wallet/types/wallet';
import { ChainId } from '@portkey-wallet/types';
import { TGetWithdrawInfoResult, TCreateWithdrawOrderResult } from '@etransfer/types';
import { IChainItemType } from '@portkey-wallet/types/types-eoa/chain';
import { ContractBasic } from '@portkey-wallet/contracts/utils/ContractBasic';
import { IStorageSuite } from '@portkey/types';
import { TAccountInfo } from '@portkey-wallet/types/types-eoa/wallet';
export interface ICrossTransferInitOption {
  account: TAccountInfo;
  eTransferUrl: string;
  pin: string;
  chainList: IChainItemType[];
  eTransferCA: {
    [x in ChainId]?: string;
  };
  storage?: IStorageSuite;
}

export interface IWithdrawPreviewParams {
  chainId: ChainId;
  address: string;
  symbol: string;
  network: string;
  amount?: string;
}

export interface IWithdrawParams {
  chainId: ChainId;
  tokenContract?: ContractBasic;
  toAddress: string;
  network: string;
  amount: string;
  tokenInfo: {
    address: string;
    symbol: string;
    decimals: number;
  };
  isCheckSymbol?: boolean;
}

export interface ICrossTransfer {
  init(options: ICrossTransferInitOption): void;
  withdrawPreview(params: IWithdrawPreviewParams): Promise<TGetWithdrawInfoResult>;
  withdraw(params: IWithdrawParams): Promise<TCreateWithdrawOrderResult>;
}

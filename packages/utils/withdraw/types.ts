import { CurrentWalletType } from '@portkey-wallet/types/wallet';
import { ChainId } from '@portkey-wallet/types';
import { TGetWithdrawInfoResult, TCreateWithdrawOrderResult } from '@etransfer/services';
import { IChainItemType } from '@portkey-wallet/types/types-ca/chain';
import { ContractBasic } from '@portkey-wallet/contracts/utils/ContractBasic';
import { IStorageSuite } from '@portkey/types';
export interface ICrossTransferInitOption {
  walletInfo: CurrentWalletType;
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
  amount: string;
}

export interface IWithdrawParams {
  chainId: ChainId;
  tokenContract: ContractBasic;
  portkeyContract: ContractBasic;
  toAddress: string;
  amount: string;
  tokenInfo: {
    address: string;
    symbol: string;
    decimals: number;
  };
}

export interface ICrossTransfer {
  init(options: ICrossTransferInitOption): void;
  withdrawPreview(params: IWithdrawPreviewParams): Promise<TGetWithdrawInfoResult>;
  withdraw(params: IWithdrawParams): Promise<TCreateWithdrawOrderResult>;
}

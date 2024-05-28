import { ChainId } from '@portkey/provider-types';

export type TShouldShowSetNewWalletNameModalResponse = boolean;

export type TShouldShowSetNewWalletNameIconResponse = boolean;

export interface ISetNewWalletNameParams {
  caHash: string;
  chainId: ChainId;
  setLoginAccount: boolean;
}

export interface IWalletNameService {
  shouldShowSetNewWalletNameModal(): Promise<TShouldShowSetNewWalletNameModalResponse>;
  shouldShowSetNewWalletNameIcon(): Promise<TShouldShowSetNewWalletNameIconResponse>;
  setNewWalletName(params: ISetNewWalletNameParams): Promise<void>;
}

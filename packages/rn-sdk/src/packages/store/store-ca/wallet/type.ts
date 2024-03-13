import { ChainId, ChainType, NetworkType } from 'packages/types';
import { CAWalletInfoType } from 'packages/types/types-ca/wallet';
import { PinErrorMessage } from 'packages/utils/wallet/types';

export type WalletType = ChainType;

export enum BaseWalletError {
  noCreateWallet = 'Please Create an Wallet First!',
  pinFailed = 'Pin Verification Failed!',
  decryptionFailed = 'Decryption Failed!',
  invalidPrivateKey = 'Invalid Private Key',
  walletExists = 'Wallet Already Exists!',
  caAccountExists = 'Account Already Exists!',
  caAccountNotExists = 'CA Account Not Exists!',
}
export const WalletError = Object.assign({}, BaseWalletError, PinErrorMessage);

export type DefaultToken = {
  address: string;
  decimals: string;
  imageUrl: string;
  name: string;
  symbol: string;
};
export interface ChainItemType {
  chainId: ChainId;
  chainName: string;
  endPoint: string;
  explorerUrl: string;
  caContractAddress: string;
  defaultToken: DefaultToken;
}

export interface WalletState {
  walletAvatar: string;
  walletType: WalletType;
  walletName: string;
  currentNetwork: NetworkType;
  walletInfo?: CAWalletInfoType;
  chainList: ChainItemType[];
  chainInfo?: { [key in NetworkType]?: ChainItemType[] };
  originChainId?: ChainId;
  userId?: string;
}

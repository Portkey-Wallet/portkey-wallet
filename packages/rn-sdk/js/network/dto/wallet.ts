import { AccountOriginalType, ContextInfo } from 'model/verify/after-verify';
import AElf from 'aelf-sdk';
import { ChainId } from '@portkey-wallet/types';

export interface RequestRegisterParams {
  chainId: string;
  loginGuardianIdentifier: string;
  verifierId: string;
  verificationDoc: string;
  signature: string;
  context: ContextInfo;
  type: AccountOriginalType;
  manager: string;
  extraData: string;
}

export interface RequestSocialRecoveryParams {
  loginGuardianIdentifier: string;
  manager: string;
  chainId: string;
  context: ContextInfo;
  extraData: string;
  guardiansApproved: ApprovedGuardianInfo[];
}

export interface ApprovedGuardianInfo {
  type: AccountOriginalType;
  identifier: string;
  verifierId: string;
  verificationDoc: string;
  signature: string;
}

export type RequestRegisterOrSocialRecoveryResultDTO = {
  sessionId: string;
};

export type WalletInfo = {
  privateKey: string;
  publicKey: string;
  address: string;
};

export type RequestProcessResult = RequestRegisterOrSocialRecoveryResultDTO & WalletInfo;

export interface CheckRegisterOrRecoveryProcessParams {
  filter: string;
}

export interface RegisterStatusDTO {
  registerStatus: ProgressStatus;
  registerMessage: string;
}

export interface SocialRecoveryStatusDTO {
  recoveryStatus: ProgressStatus;
  recoveryMessage: string;
}

export enum ProgressStatus {
  PENDING = 'pending',
  PASS = 'pass',
  FAIL = 'fail',
}

export interface BaseAccountStatus {
  chainId: ChainId;
  caHash: string;
  caAddress: string;
  managerInfo: {
    address: string;
    extraData: string;
  };
}

export interface BaseProgressDTO<T> {
  totalCount: number;
  items: Array<BaseAccountStatus & T>;
}

export type RegisterProgressDTO = BaseProgressDTO<RegisterStatusDTO>;
export type RecoveryProgressDTO = BaseProgressDTO<SocialRecoveryStatusDTO>;

export const isRecoveryStatusItem = (
  item: RegisterStatusDTO | SocialRecoveryStatusDTO,
): item is SocialRecoveryStatusDTO => {
  return 'recoveryStatus' in item;
};

export const AElfWeb3SDK: AElfWeb3SDK = AElf.wallet;

export interface AElfWeb3SDK {
  getWalletByPrivateKey: (privKey: string) => AElfWalletInstance;
  getWalletByMnemonic: (mnemonic: string) => AElfWalletInstance;
  createNewWallet: () => AElfWalletInstance;
  getAddressFromPubKey: (pubKey: string) => string;
}

export interface AElfWalletInstance {
  address: string;
  mnemonic: string;
  privateKey: string;
  keyPair: AElfKeyPair;
}

export interface AElfKeyPair {
  getPublic: (enc: 'hex') => string;
}

export interface AElfChainStatusDTO {
  totalCount: number;
  items: Array<AElfChainStatusItemDTO>;
}

export interface AElfChainStatusItemDTO {
  chainId: string;
  chainName: string;
  endPoint: string;
  explorerUrl: string;
  caContractAddress: string;
  lastModifyTime: string;
  id: string;
  defaultToken: any;
}

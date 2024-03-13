import { WalletInfoType } from '../wallet';
import { ChainId, NetworkType } from 'packages/types';
import { VerificationType } from '../verifier';

export type ManagerInfo = {
  managerUniqueId: string;
  loginAccount: string;
  type: LoginType;
  verificationType: VerificationType;
  requestId?: string;
};

export enum LoginType {
  Email,
  Phone,
  Google,
  Apple,
}

export type LoginKeyType = string;

export type LoginKey = keyof typeof LoginType;

export type ISocialLogin = LoginKey;

export interface CAInfo {
  caAddress: string;
  caHash: string;
  isSync?: boolean;
  // TODO: id
}
export type CAInfoType = {
  originChainId?: ChainId;
  managerInfo?: ManagerInfo;
} & { [key in ChainId]?: CAInfo };

export interface CAWalletInfoType extends WalletInfoType {
  caInfo: {
    [key in NetworkType]: CAInfoType;
  };
}

export type RegisterStatus = 'pass' | 'pending' | 'fail' | null;

export interface CreateWalletResult {
  caAddress: string;
  caHash: string;
  message: null | string;
  status: RegisterStatus;
}

export interface RegisterBody {
  caAddress: string;
  caHash: string;
  registerMessage: null | string;
  registerStatus: RegisterStatus;
}

export interface RecoverBody {
  caAddress: string;
  caHash: string;
  recoveryMessage: null | string;
  recoveryStatus: RegisterStatus;
}

export interface CaAccountRegisterResult {
  requestId: string;
  body: RegisterBody;
}

export interface CaAccountRecoverResult {
  requestId: string;
  body: RecoverBody;
}

export interface CaHolderInfo {
  userId: string;
  caHash: string;
  walletName: string;
}

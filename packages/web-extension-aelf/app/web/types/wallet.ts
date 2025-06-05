import { ISocialLogin } from '@portkey-wallet/types/types-ca/wallet';

export type CreateType = 'Import' | 'Create';
export type InfoActionType = 'add' | 'update' | 'remove';
export type RegisterType = 'Login' | 'Sign up';

export type isRegisterType = 0 | 1 | 2;

export interface AESEncryptWalletParam {
  AESEncryptPrivateKey?: string;
  AESEncryptMnemonic?: string;
}

export type ValidateHandler = (data?: any) => Promise<any>;

export type SocialLoginFinishHandler = (value: {
  type: ISocialLogin;
  data?: {
    assess_token: string;
    [x: string]: any;
  };
}) => void;

export enum VerifyTypeEnum {
  zklogin = 'zklogin',
}

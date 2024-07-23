import { UserGuardianItem } from '@portkey-wallet/store/store-ca/guardians/type';
import { ChainId } from '@portkey-wallet/types';
import { LoginType } from '@portkey-wallet/types/types-ca/wallet';
import { AuthenticationInfo, OperationTypeEnum } from '@portkey-wallet/types/verifier';
import { AppleUserInfo, TFacebookUserInfo, TelegramUserInfo } from '@portkey-wallet/utils/authentication';

export type TGoogleAuthentication = {
  accessToken: string;
  idToken: string;
  nonce: string;
  user: {
    email: string;
    familyName: string;
    givenName: string;
    id: string;
    name: string;
    photo: string;
  };
};

export type TAppleAuthentication = {
  user: AppleUserInfo & {
    id: string;
  };
  identityToken: string;
  fullName?: {
    givenName?: string;
    familyName?: string;
  };
  nonce: string;
};

export type TFacebookAuthentication = {
  user: TFacebookUserInfo;
  accessToken: string;
  nonce: string;
};

export type TelegramAuthentication = {
  user: TelegramUserInfo;
  accessToken: string;
};

export type TTwitterAuthentication = {
  accessToken: string;
  authType: 'Twitter';
  user: {
    id: string;
    name: string;
    userName: string;
  };
};

export type TVerifierAuthParams = {
  guardianItem: UserGuardianItem;
  originChainId: ChainId;
  operationType?: OperationTypeEnum;
  authenticationInfo?: AuthenticationInfo;
  operationDetails?: string;
};

export interface IAuthenticationSign {
  sign(type: LoginType.Google): Promise<TGoogleAuthentication>;
  sign(type: LoginType.Apple): Promise<TAppleAuthentication>;
  sign(type: LoginType.Telegram): Promise<TelegramAuthentication>;
  sign(type: LoginType.Twitter): Promise<TTwitterAuthentication>;
  sign(type: LoginType.Facebook): Promise<TFacebookAuthentication>;
}

export type TGoogleAuthResponse = TGoogleAuthentication;

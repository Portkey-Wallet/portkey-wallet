import { ChainId } from '@portkey-wallet/types';
import { LoginType } from '@portkey-wallet/types/types-ca/wallet';
import { OperationTypeEnum } from '@portkey-wallet/types/verifier';
import { TypedUrlParams } from 'service/native-modules';

export interface GetRecommendedGuardianParams {
  chainId: string;
}

export interface GetRecommendedGuardianResultDTO {
  id: string;
  name: string;
  imageUrl: string;
}

export interface GetGuardianInfoParams {
  chainId: string;
  loginGuardianIdentifier: string;
  guardianIdentifier: string;
}

export type GetGuardianInfoResultDTO = {
  guardianList: {
    guardians: Array<GuardianInfo>;
  };
  managerInfos: Array<ManagerInfo>;
} & CaInfo;

export interface GuardianInfo {
  guardianIdentifier: string;
  identifierHash: string;
  isLoginGuardian: boolean;
  salt: string;
  type: string;
  verifierId: string;
  id?: string;
  name?: string;
  imageUrl?: string;
  thirdPartyEmail?: string;
  isPrivate?: boolean;
  firstName?: string;
  lastName?: string;
}

export interface ManagerInfo {
  address: string;
  extraData: string;
}
export interface CaInfo {
  caAddress: string;
  caHash: string;
}

export interface SendVerifyCodeParams {
  type: AccountOrGuardianOriginalTypeStr;
  guardianIdentifier: string;
  verifierId: string;
  chainId: ChainId;
  targetChainId?: ChainId;
  operationType: OperationTypeEnum;
}

export type SendVerifyCodeParamsDTO = SendVerifyCodeParams & {
  platformType: RecaptchaPlatformType;
};

export interface SendVerifyCodeHeader extends TypedUrlParams {
  reCaptchaToken: string;
}

export interface SendVerifyCodeResultDTO {
  verifierSessionId: string;
}

export type AccountOrGuardianOriginalTypeStr = keyof typeof LoginType;

export enum RecaptchaPlatformType {
  JS = 0,
  ANDROID = 1,
  IOS = 2,
}

export interface CheckVerifyCodeParams {
  verifierSessionId: string;
  verificationCode: string;
  guardianIdentifier: string;
  verifierId: string;
  chainId: string;
  operationType: OperationTypeEnum;
}

export interface CheckVerifyCodeResultDTO {
  verificationDoc: string;
  signature: string;
  failedBecauseOfTooManyRequests?: boolean;
}

export interface VerifyGoogleGuardianParams {
  accessToken: string;
  verifierId: string;
  chainId: string;
  operationType: OperationTypeEnum;
}

export interface VerifyAppleGuardianParams {
  accessToken: string;
  verifierId: string;
  id: string;
  chainId: string;
  operationType: OperationTypeEnum;
}

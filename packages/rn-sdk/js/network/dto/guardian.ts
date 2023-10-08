import { ChainId } from '@portkey-wallet/types';
import { LoginType } from '@portkey-wallet/types/types-ca/wallet';
import { OperationTypeEnum } from '@portkey-wallet/types/verifier';
import { TypedUrlParams } from 'service/native-modules';

export interface SendVerifyCodeParams {
  type: AccountOrGuardianOriginalTypeStr;
  guardianIdentifier: string;
  verifierId: string;
  chainId: ChainId;
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
}

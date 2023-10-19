import { AccountOriginalType, ContextInfo } from 'model/verify/after-verify';

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

export interface RequestRegisterOrSocialRecoveryResult {
  sessionId: string;
}

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
  FAIl = 'fail',
}

export interface BaseProgressDTO<T> {
  totalCount: number;
  items: Array<
    {
      caAddress: string;
      caHash: string;
    } & T
  >;
}

export type RegisterProgressDTO = BaseProgressDTO<RegisterStatusDTO>;
export type RecoveryProgressDTO = BaseProgressDTO<SocialRecoveryStatusDTO>;

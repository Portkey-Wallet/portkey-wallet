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
  guardians: ApprovedGuardianInfo[];
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

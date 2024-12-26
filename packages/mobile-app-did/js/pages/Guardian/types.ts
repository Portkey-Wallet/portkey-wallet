import { LoginKeyType, LoginType } from '@portkey-wallet/types/types-ca/wallet';
import { VerifierInfo, VerifyStatus, ZKLoginInfo } from '@portkey-wallet/types/verifier';

export type GuardianApproved = {
  guardianType: LoginType;
  type: LoginKeyType;
  value: string;
  verifierId: string;
  verificationDoc: string;
  signature: string;
  zkLoginInfo: ZKLoginInfo;
};

export type GuardiansApproved = GuardianApproved[];

export type GuardiansStatusItem = {
  status: VerifyStatus;
  requestCodeResult?: { verifierSessionId: string };
  verifierInfo?: VerifierInfo;
};

export type GuardiansStatus = {
  [key: string]: GuardiansStatusItem;
};

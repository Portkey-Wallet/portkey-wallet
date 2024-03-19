import { LoginKeyType } from '@portkey-wallet/types/types-ca/wallet';
import { VerifierInfo, VerifyStatus } from '@portkey-wallet/types/verifier';

export type GuardianApproved = {
  type: LoginKeyType;
  value: string;
  verifierId: string;
  verificationDoc: string;
  signature: string;
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

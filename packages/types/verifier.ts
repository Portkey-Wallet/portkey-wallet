export enum VerifyStatus {
  NotVerified = 'NotVerified',
  Verifying = 'Verifying',
  Verified = 'Verified',
}

export interface VerifierItem {
  id: string; // aelf.Hash
  name: string;
  imageUrl: string;
  endPoints: string[];
  verifierAddresses: string[];
}

// 0: register, 1: community recovery, 2: Add Guardian 3: Set LoginAccount 4: addManager
export enum VerificationType {
  register,
  communityRecovery,
  addGuardian,
  setLoginAccount,
  addManager,
  optGuardianApproval,
}

export enum ApprovalType {
  communityRecovery,
  addGuardian,
  deleteGuardian,
  editGuardian,
  removeOtherManager,
}

export enum RecaptchaType {
  register = 0,
  communityRecovery = 1,
  optGuardian = 2,
}

export interface VerifierInfo {
  verifierId: string;
  verificationDoc: string;
  signature: string;
}

export interface AuthenticationInfo {
  [userId: string]: string;
}

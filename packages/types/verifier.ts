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
  editGuardianApproval,
}

export enum ApprovalType {
  register,
  addGuardian,
  deleteGuardian,
  editGuardian,
  removeOtherManager,
}

export interface VerifierInfo {
  verifierId: string;
  verificationDoc: string;
  signature: string;
}

export interface AuthenticationInfo {
  [userId: string]: string;
}

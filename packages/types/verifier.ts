export enum VerifyStatus {
  NotVerified = 'NotVerified',
  Verifying = 'Verifying',
  Verified = 'Verified',
}

export interface VerifierItem {
  id: string; // aelf.Hash
  name: string;
  imageUrl: string;
}

export const zkLoginVerifierItem: VerifierItem = {
  id: 'zkLogin',
  name: 'zkLogin',
  imageUrl: '', // todo_wade: add image url
};

// 0: register, 1: community recovery, 2: Add Guardian 3: Set LoginAccount 4: addManager
export enum VerificationType {
  register,
  communityRecovery,
  addGuardian,
  setLoginAccount,
  addManager,
  editGuardian,
  removeOtherManager,
  addGuardianByApprove,
  deleteGuardian,
  managerApprove,
  modifyTransferLimit,
  transferApprove,
  setLoginAccountByApprove,
  unsetLoginAccount,
  unsetLoginAccountByApprove,
  revokeAccount,
}

export enum ApprovalType {
  communityRecovery,
  addGuardian,
  deleteGuardian,
  editGuardian,
  removeOtherManager,
  managerApprove,
  modifyTransferLimit,
  transferApprove,
  setLoginAccount,
  unsetLoginAccount,
}

// Indicates the type of operation to generate a signature file
export enum OperationTypeEnum {
  unknown = 0,
  register = 1,
  communityRecovery = 2,
  addGuardian = 3,
  deleteGuardian = 4,
  editGuardian = 5,
  removeOtherManager = 6,
  setLoginAccount = 7,
  managerApprove = 8,
  modifyTransferLimit = 9,
  transferApprove = 10,
  unsetLoginAccount = 11,
  revokeAccount = 12,
}

export interface ZKJwtAuthInfo {
  identifierHash: string;
  salt: string;
  zkProof: string;
  jwt: string;
  nonce: string;
  circuitId: string;
}

export interface VerifierInfo {
  verifierId: string;
  verificationDoc?: string;
  signature?: string;
  zkJwtAuthInfo: ZKJwtAuthInfo;
}

export interface AuthenticationInfo {
  [userId: string]: string;
}

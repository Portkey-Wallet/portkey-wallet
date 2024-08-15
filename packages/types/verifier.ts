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
  // id: '53961cca496a1cfaa7bf2dda210afb4f6430283cce4239be099ade5647091928', // sha256('zkLogin')
  id: '',
  name: 'zkLogin',
  imageUrl: 'https://portkey-did.s3.ap-northeast-1.amazonaws.com/zklogin_verifier.png',
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

export interface ZKLoginInfo {
  identifierHash: string;
  poseidonIdentifierHash: string;
  identifierHashType: number;
  salt: string;
  zkProof: string;
  jwt: string;
  nonce: string;
  circuitId: string;
}

export interface ZKProofInfo {
  zkProofPiA: string;
  zkProofPiB1: string;
  zkProofPiB2: string;
  zkProofPiB3: string;
  zkProofPiC: string;
}

export interface ZKLoginInfoInContract {
  identifierHash: string;
  poseidonIdentifierHash: string;
  salt: string;
  kid: string;
  circuitId: string;
  zkProof: string;
  zkProofInfo: ZKProofInfo;
  nonce: string;
  issuer: string;
}

export interface VerifierInfo {
  verifierId: string;
  verificationDoc?: string;
  signature?: string;
  zkLoginInfo?: ZKLoginInfo;
}

export interface AuthenticationInfo {
  [userId: string]: string;
}

import { LoginKeyType } from './wallet';
export interface Verifier {
  id: string; // aelf.Hash
}
export interface Guardian {
  guardianIdentifier: string;
  identifierHash: string;
  isLoginGuardian: boolean;
  salt: string;
  type: LoginKeyType;
  verifierId: string;
  thirdPartyEmail?: string;
  isPrivate?: boolean;
  firstName?: string;
  lastName?: string;
}

export interface GuardianAccount {
  guardian: Guardian;
  value: string;
}
export interface Manager {
  address: string; //aelf.Address
  extraData: string;
}
export interface GuardiansInfo {
  guardianList: { guardians: Guardian[] };
  managerInfos: Manager[];
}

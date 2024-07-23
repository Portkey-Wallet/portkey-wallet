import { ZKLoginInfo } from '../verifier';
import { LoginKeyType, LoginType } from './wallet';
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
  manuallySupportForZk?: boolean;
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

export type GuardiansApprovedType = {
  identifierHash: string;
  type: LoginType;
  verificationInfo: {
    id: string | undefined;
    signature: number[];
    verificationDoc: string;
  };
  zkLoginInfo: ZKLoginInfo | undefined;
};

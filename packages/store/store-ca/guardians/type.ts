import { LoginType } from '@portkey-wallet/types/types-ca/wallet';
import { VerifierItem, VerifyStatus } from '@portkey-wallet/types/verifier';
import { ZKLoginInfo } from '@portkey-wallet/types/verifier';

type VerifyName = string;
export interface BaseGuardianItem {
  isLoginAccount: boolean | undefined;
  verifier?: VerifierItem;
  guardianAccount: string;
  guardianType: LoginType;
  key: string; // `${loginGuardianType}&${verifier?.name}`,
  identifierHash: string;
  poseidonIdentifierHash: string;
  salt: string;
  thirdPartyEmail?: string;
  isPrivate?: boolean;
  firstName?: string;
  lastName?: string;
  verifiedByZk?: boolean;
  manuallySupportForZk?: boolean;
  zkLoginInfo?: ZKLoginInfo;
}

export interface IVerifierInfo {
  sessionId: string;
  endPoint?: string;
}

export interface UserGuardianItem extends BaseGuardianItem {
  verifierInfo?: IVerifierInfo;
  isInitStatus?: boolean;
}

export interface UserGuardianStatus extends UserGuardianItem {
  status?: VerifyStatus;
  signature?: string;
  verificationDoc?: string;
}

export interface GuardiansState {
  verifierMap?: { [x: VerifyName]: VerifierItem };
  userGuardiansList?: UserGuardianItem[];
  userGuardianStatus?: { [x: string]: UserGuardianStatus };
  currentGuardian?: UserGuardianItem;
  preGuardian?: StoreUserGuardianItem;
  opGuardian?: StoreUserGuardianItem; // operating guardians
  guardianExpiredTime?: number; // timestamp
}

export interface StoreUserGuardianItem extends UserGuardianItem {
  phone?: { code: string; phoneNumber: string };
  social?: {
    id: string;
    name: string;
    value: string;
    accessToken: string;
    isPrivate?: boolean;
  };
}

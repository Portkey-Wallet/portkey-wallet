import { LoginType } from '@portkey-wallet/types/types-ca/wallet';
import { IconType } from './icon';

export enum GuardianMth {
  addGuardian = 'AddGuardian',
  UpdateGuardian = 'UpdateGuardian',
  RemoveGuardian = 'RemoveGuardian',
  SetGuardianTypeForLogin = 'SetGuardianForLogin',
  UnsetGuardianTypeForLogin = 'UnsetGuardianForLogin',
}

export interface IGuardianType {
  label: string;
  value: LoginType;
  icon: IconType;
}

export interface VerifierType {
  name: string;
  signature?: number[];
  verificationDoc?: string;
}

export interface verificationInfo {
  id: string;
  signature?: number[];
  verificationDoc?: string;
}

export interface GuardianItem {
  value?: string;
  type: LoginType;
  identifierHash?: string;
  verificationInfo: verificationInfo;
}

export interface IPhoneInput {
  code: string;
  phoneNumber: string;
}

export interface ISocialInput {
  id: string;
  name: string;
  value: string;
  accessToken: string;
  isPrivate?: boolean;
}

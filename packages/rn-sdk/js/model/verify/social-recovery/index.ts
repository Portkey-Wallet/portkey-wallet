import { AccountOriginalType } from '../after-verify';
import { GuardianConfig } from '../guardian';
import { CheckVerifyCodeResultDTO } from 'network/dto/guardian';
import { ThirdPartyAccountInfo } from '../third-party-account';

export interface GuardianVerifyConfig {
  guardianVerifyType: GuardianVerifyType;
  accountIdentifier: string;
  accountOriginalType: AccountOriginalType;
  guardians: Array<GuardianConfig>;
  particularGuardian?: GuardianConfig;
  thirdPartyAccountInfo?: ThirdPartyAccountInfo;
}

export enum GuardianVerifyType {
  CREATE_WALLET = 'CREATE_WALLET',
  ADD_GUARDIAN = 'ADD_GUARDIAN',
  MODIFY_GUARDIAN = 'MODIFY_GUARDIAN',
  REMOVE_GUARDIAN = 'REMOVE_GUARDIAN',
  CHANGE_LOGIN_GUARDIAN = 'CHANGE_LOGIN_GUARDIAN',
}

export type VerifiedGuardianInfo = CheckVerifyCodeResultDTO;

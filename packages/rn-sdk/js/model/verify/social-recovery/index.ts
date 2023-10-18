import { AccountOriginalType } from '../after-verify';
import { GuardianConfig } from '../guardian';
import { CheckVerifyCodeResultDTO } from 'network/dto/guardian';

export interface SocialRecoveryConfig {
  accountIdentifier: string;
  accountOriginalType: AccountOriginalType;
  guardians: Array<GuardianConfig>;
}

export type VerifiedGuardianInfo = CheckVerifyCodeResultDTO;

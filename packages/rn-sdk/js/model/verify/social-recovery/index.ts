import { AccountOriginalType } from '../after-verify';
import { GuardianConfig } from '../guardian';
import { CheckVerifyCodeResultDTO } from 'network/dto/guardian';
import { ThirdPartyAccountInfo } from '../third-party-account';

export interface SocialRecoveryConfig {
  accountIdentifier: string;
  accountOriginalType: AccountOriginalType;
  guardians: Array<GuardianConfig>;
  thirdPartyAccountInfo?: ThirdPartyAccountInfo;
}

export type VerifiedGuardianInfo = CheckVerifyCodeResultDTO;

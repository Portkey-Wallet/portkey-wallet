import { GuardianConfig } from '../guardian';
import { AccountOriginalType, VerifiedGuardianDoc } from '../after-verify';

export interface SignUpConfig {
  accountIdentifier: string;
  accountOriginalType: AccountOriginalType;
  guardianConfig?: GuardianConfig;
  navigateToGuardianPage: (guardianConfig: GuardianConfig, callback: (data: VerifiedGuardianDoc) => void) => void;
}

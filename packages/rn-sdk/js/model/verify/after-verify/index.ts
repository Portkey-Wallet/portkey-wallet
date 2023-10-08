import { DeviceInfoType } from '@portkey-wallet/types/types-ca/device';

export interface AfterVerifiedConfig {
  fromRecovery: boolean;
  accountIdentifier: string;
  verifiedGuardians: Array<VerifiedGuardianDoc>;
  manager: string; // Manager is the address of the accountIdentifier
  chainId: string;
  context: ContextInfo;
  extraData: DeviceInfoType;
}

export interface ContextInfo {
  clientId: string; // Actually it's the address of the KeyPair
  requestId: string; // private final String requestId = UUID.randomUUID().toString().replaceAll("-", "");
}

export interface VerifiedGuardianDoc {
  type: AccountOriginalType;
  identifier: string;
  verifierId: string;
  verificationDoc: string;
  signature: string;
}

export enum AccountOriginalType {
  Email = 0,
  Phone = 1,
  Google = 2,
  Apple = 3,
}

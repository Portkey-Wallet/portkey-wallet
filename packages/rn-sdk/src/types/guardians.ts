import { LoginType } from '@portkey-wallet/types/types-ca/wallet';

export type GuardiansApprovedType = {
  identifierHash: string;
  type: LoginType;
  verificationInfo: {
    id: string | undefined;
    signature: number[];
    verificationDoc: string;
  };
};

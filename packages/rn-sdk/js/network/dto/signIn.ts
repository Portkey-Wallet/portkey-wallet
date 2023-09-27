import { GuardiansInfo } from '@portkey-wallet/types/types-ca/guardian';
import { CAInfo } from '@portkey-wallet/types/types-ca/wallet';

export interface RegisterStatusDTO {
  originChainId: string;
}

export type AccountIdentifierStatusDTO = GuardiansInfo & Pick<CAInfo, 'caAddress' | 'caHash'>;

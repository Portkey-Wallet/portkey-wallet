import { GuardiansInfo } from 'packages/types/types-ca/guardian';
import { CAInfo } from 'packages/types/types-ca/wallet';

export interface RegisterStatusDTO {
  originChainId: string;
}

export type AccountIdentifierStatusDTO = GuardiansInfo & Pick<CAInfo, 'caAddress' | 'caHash'>;

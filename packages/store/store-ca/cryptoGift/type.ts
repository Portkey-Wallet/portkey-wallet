import { RedPackageConfigType } from '@portkey-wallet/im/types';
import { NetworkType } from '@portkey-wallet/types';

export interface CryptoGiftStateType {
  redPackageConfigMap?: {
    [T in NetworkType]?: RedPackageConfigType;
  };
}

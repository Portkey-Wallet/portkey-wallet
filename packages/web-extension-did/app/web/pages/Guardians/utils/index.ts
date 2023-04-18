import { LoginType } from '@portkey-wallet/types/types-ca/wallet';
import { IconType } from 'types/icon';

export const guardianIconMap: Record<LoginType, IconType> = {
  [LoginType.Email]: 'email',
  [LoginType.Phone]: 'GuardianPhone',
  [LoginType.Apple]: 'GuardianApple',
  [LoginType.Google]: 'GuardianGoogle',
};

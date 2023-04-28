import { LoginType } from '@portkey-wallet/types/types-ca/wallet';
import { IGuardianType, IPhoneInput, ISocialInput } from 'types/guardians';

export const guardianTypeList: IGuardianType[] = [
  { label: 'Phone', value: LoginType.Phone, icon: 'GuardianPhone' },
  { label: 'Email', value: LoginType.Email, icon: 'email' },
  { label: 'Google', value: LoginType.Google, icon: 'GuardianGoogle' },
  { label: 'Apple', value: LoginType.Apple, icon: 'GuardianApple' },
];

export const phoneInit: IPhoneInput = {
  code: '+65',
  phoneNumber: '',
};

export const socialInit: ISocialInput = {
  accessToken: '',
  id: '',
  name: '',
  value: '',
  isPrivate: false,
};

import { LoginType } from '@portkey-wallet/types/types-ca/wallet';
import { IGuardianType, IPhoneInput, ISocialInput } from 'types/guardians';

export const guardianTypeList: IGuardianType[] = [
  { label: 'Phone', value: LoginType.Phone, icon: 'GuardianPhone' },
  { label: 'Email', value: LoginType.Email, icon: 'email' },
  { label: 'Google', value: LoginType.Google, icon: 'GuardianGoogle' },
  { label: 'Apple', value: LoginType.Apple, icon: 'GuardianApple' },
  // { label: 'Telegram', value: LoginType.Telegram, icon: 'GuardianTelegram' },
];

export const phoneInit: IPhoneInput = {
  code: '',
  phoneNumber: '',
};

export const socialInit: ISocialInput = {
  accessToken: '',
  id: '',
  name: '',
  value: '',
  isPrivate: false,
};

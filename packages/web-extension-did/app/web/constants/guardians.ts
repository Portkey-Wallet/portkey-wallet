import { LoginType } from '@portkey-wallet/types/types-ca/wallet';
import { IGuardianType, IPhoneInput, ISocialInput } from 'types/guardians';

export const guardianTypeList: IGuardianType[] = [
  { label: 'Email', value: LoginType.Email, icon: 'Email' },
  { label: 'Phone', value: LoginType.Phone, icon: 'Phone' },
  { label: 'Google', value: LoginType.Google, icon: 'Google' },
  { label: 'Apple', value: LoginType.Apple, icon: 'Apple' },
  { label: 'Telegram', value: LoginType.Telegram, icon: 'Telegram' },
  { label: 'Twitter', value: LoginType.Twitter, icon: 'Twitter' },
  { label: 'Facebook', value: LoginType.Facebook, icon: 'Facebook' },
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

import { ISocialLogin, LoginType } from '@portkey-wallet/types/types-ca/wallet';
import { IGuardianTypeV3, IPhoneInput, ISocialInput } from 'types/guardians';

// export const guardianTypeList: IGuardianType[] = [
//   { label: 'Email', value: LoginType.Email, icon: 'Email' },
//   { label: 'Phone', value: LoginType.Phone, icon: 'Phone' },
//   { label: 'Google', value: LoginType.Google, icon: 'Google' },
//   { label: 'Apple', value: LoginType.Apple, icon: 'Apple' },
//   { label: 'Telegram', value: LoginType.Telegram, icon: 'Telegram' },
//   { label: 'Twitter', value: LoginType.Twitter, icon: 'Twitter' },
//   { label: 'Facebook', value: LoginType.Facebook, icon: 'Facebook' },
// ];

export const guardianTypeListV3: IGuardianTypeV3[] = [
  { label: 'Email', value: LoginType.Email, icon: 'Guardians=Email' },
  { label: 'Phone', value: LoginType.Phone, icon: 'Guardians=Phone' },
  { label: 'Google', value: LoginType.Google, icon: 'Guardians=Google' },
  { label: 'Apple', value: LoginType.Apple, icon: 'Guardians=Apple' },
  { label: 'Telegram', value: LoginType.Telegram, icon: 'Guardians=Telegram' },
  { label: 'Twitter', value: LoginType.Twitter, icon: 'Guardians=X' },
  { label: 'Facebook', value: LoginType.Facebook, icon: 'Guardians=Facebook' },
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

export const zkloginGuardianType: ISocialLogin[] = ['Google', 'Apple'];

export const GuardianApproveHelpUrl = `https://doc.portkey.finance/docs/What-are-guardians-and-verifiers`;

import { NetworkType } from '@portkey-wallet/types';

export enum RedDotsType {
  'REFERRAL' = 0,
}

export enum ReferralStatusEnum {
  'UN_VIEWED' = 0,
  'VIEWED' = 1,
}

export interface ReferralStateType {
  viewReferralStatusMap: {
    [T in NetworkType]?: ReferralStatusEnum;
  };
  referralLinkMap: {
    [T in NetworkType]?: string;
  };
}

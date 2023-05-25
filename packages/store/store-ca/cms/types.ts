import { NetworkType } from '@portkey-wallet/types';

export interface SocialMediaItem {
  index: number;
  title: string;
  link: string;
  svgUrl?: {
    filename_disk?: string;
  };
}

export interface TabMenuItem {
  index: number;
  title: string;
  type: {
    value: string;
  };
}

export interface CMSState {
  socialMediaListNetMap: {
    [T in NetworkType]?: SocialMediaItem[];
  };
  tabMenuListNetMap: {
    [T in NetworkType]?: TabMenuItem[];
  };
}

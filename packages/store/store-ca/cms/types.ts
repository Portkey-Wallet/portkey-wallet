import { NetworkType } from '@portkey-wallet/types';

export interface SocialMediaItem {
  index: number;
  title: string;
  link: string;
  svgUrl?: string;
}

export interface tabMenuItem {
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
    [T in NetworkType]?: tabMenuItem[];
  };
}

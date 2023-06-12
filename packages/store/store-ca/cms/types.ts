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

export interface DiscoverItem {
  id: string;
  index: number;
  title: string;
  description: string;
  url: string;
  imgUrl?: {
    filename_disk?: string;
  };
}
export interface DiscoverGroup {
  id: string;
  index: number;
  title: string;
  items: DiscoverItem[];
}

export interface CMSState {
  socialMediaListNetMap: {
    [T in NetworkType]?: SocialMediaItem[];
  };
  tabMenuListNetMap: {
    [T in NetworkType]?: TabMenuItem[];
  };
  discoverGroupListNetMap: {
    [T in NetworkType]?: DiscoverGroup[];
  };
}

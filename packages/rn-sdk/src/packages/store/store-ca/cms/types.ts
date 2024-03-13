import { NetworkType } from 'packages/types';

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

export interface BuyButtonType {
  isBuySectionShow?: boolean;
  isSellSectionShow?: boolean;
  isAndroidBuyShow?: boolean;
  isAndroidSellShow?: boolean;
  isExtensionBuyShow?: boolean;
  isExtensionSellShow?: boolean;
  isIOSBuyShow?: boolean;
  isIOSSellShow?: boolean;
}

export interface RememberMeBlackListSiteItem {
  name: string;
  url: string;
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
  buyButtonNetMap?: {
    [T in NetworkType]?: BuyButtonType;
  };
  rememberMeBlackListMap?: {
    [T in NetworkType]?: RememberMeBlackListSiteItem[];
  };
}

import { NetworkType } from '@portkey-wallet/types';
import {
  IEntrance,
  ILoginModeItem,
  TDiscoverDappBannerList,
  TDiscoverEarnList,
  TDiscoverLearnBannerList,
  TDiscoverLearnGroupList,
  TDiscoverTabList,
  THomeBannerList,
  TTokenDetailBannerList,
  TWhiteListDappList,
} from '@portkey-wallet/types/types-ca/cms';

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
  appLink?: string;
  extensionLink?: string;
}
export interface DiscoverGroup {
  id: string;
  index: number;
  title: string;
  items: DiscoverItem[];
}

export interface RememberMeBlackListSiteItem {
  name: string;
  url: string;
}

export interface EntranceControlType {
  isAndroidBridgeShow?: boolean;
  isExtensionBridgeShow?: boolean;
  isIOSBridgeShow?: boolean;
}

export interface CmsWebsiteMapItem {
  title?: string;
  imgUrl?: {
    filename_disk?: string;
  };
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
  rememberMeBlackListMap?: {
    [T in NetworkType]?: RememberMeBlackListSiteItem[];
  };
  cmsWebsiteMap?: {
    [url: string]: CmsWebsiteMapItem;
  };
  entranceNetMap?: {
    [T in NetworkType]?: Partial<IEntrance>;
  };
  loginModeListMap?: {
    [T in NetworkType]?: ILoginModeItem[];
  };
  homeBannerListMap?: {
    [T in NetworkType]?: THomeBannerList;
  };
  tokenDetailBannerListMap?: {
    [T in NetworkType]?: TTokenDetailBannerList;
  };
  discoverDappBannerListMap?: {
    [T in NetworkType]?: TDiscoverDappBannerList;
  };
  discoverLearnBannerListMap?: {
    [T in NetworkType]?: TDiscoverLearnBannerList;
  };
  discoverTabListMap?: {
    [T in NetworkType]?: TDiscoverTabList;
  };
  discoverEarnListMap: {
    [T in NetworkType]?: TDiscoverEarnList;
  };
  discoverLearnGroupListMap: {
    [T in NetworkType]?: TDiscoverLearnGroupList;
  };
  dappWhiteListMap: {
    [T in NetworkType]?: TWhiteListDappList;
  };
}

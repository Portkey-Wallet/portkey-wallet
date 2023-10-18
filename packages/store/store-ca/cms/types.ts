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

export interface RememberMeBlackListSiteItem {
  name: string;
  url: string;
}

export type IEntranceModuleName = 'buy' | 'sell' | 'bridge';

export type IEntranceMatchKey = 'version' | 'installationTime' | 'deviceType';
export type IEntranceMatchRuleType = 'String' | 'BigNumber' | 'Regex';
export type IEntranceMatchRuleItem = {
  type: IEntranceMatchRuleType;
  left: string;
  opt: string;
  right: IEntranceMatchKey;
};
export type IEntranceMatchItem = {
  matchRuleList: IEntranceMatchRuleItem[];
  weight: number;
  matchSwitch: boolean;
};
export type IEntranceItem = {
  moduleName: {
    value: IEntranceModuleName;
  };
  defaultSwitch: boolean;
  matchList: Array<{
    entranceMatch_id: IEntranceMatchItem;
  }>;
};

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
  entranceListNetMap?: {
    [T in NetworkType]?: IEntranceItem[];
  };
}

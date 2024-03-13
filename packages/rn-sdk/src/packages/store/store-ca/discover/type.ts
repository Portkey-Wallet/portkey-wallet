import { NetworkType } from 'packages/types';

export interface ITabItem {
  id: number;
  name: string;
  url: string;
  screenShotUrl?: string;
}

export interface IBookmarkItem {
  id: string;
  name: string;
  url: string;
  index: number;
}

export interface IDiscoverNetworkStateType {
  recordsList: ITabItem[];
  whiteList: string[];
  tabs: ITabItem[];
  bookmarkList?: IBookmarkItem[];
}

export interface IDiscoverStateType {
  isDrawerOpen: boolean;
  discoverMap?: {
    [key in NetworkType]?: IDiscoverNetworkStateType;
  };
  initializedList?: Set<number>;
  activeTabId?: number;
  autoApproveMap?: { [id: number]: true };
}

import { NetworkType } from '@portkey-wallet/types';

export interface ITabItem {
  id: number;
  name: string;
  url: string;
  screenShotUrl?: string;
}

export interface IDiscoverNetworkStateType {
  recordsList: ITabItem[];
  whiteList: any[];
  tabs: ITabItem[];
}

export interface IDiscoverStateType {
  isDrawerOpen: boolean;
  discoverMap?: {
    [key in NetworkType]?: IDiscoverNetworkStateType;
  };
  initializedList?: Set<number>;
  activeTabId?: number;
}

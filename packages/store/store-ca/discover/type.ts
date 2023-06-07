import { IRecordsItemType } from '@portkey-wallet/types/types-ca/discover';

export interface ITabItem {
  id: string | number;
  name: string;
  url: string;
  screenShotUrl: string;
}
export interface IDiscoverStateType {
  isDrawerOpen: boolean;
  recordsList: IRecordsItemType[];
  whiteList: any[];
  activeTabId: number;
  tabs: ITabItem[];
}

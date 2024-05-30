import { NetworkType } from '@portkey-wallet/types';

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
  marketInfo?: IMarketInfo;
  preMarketInfo?: IPreMarketSelectedInfo;
}

export interface IDiscoverStateType {
  isDrawerOpen: boolean;
  discoverMap?: {
    [key in NetworkType]?: IDiscoverNetworkStateType;
  };
  initializedList?: Set<number>;
  activeTabId?: number;
  autoApproveMap?: { [id: number]: true };
  disclaimerConfirmedMap?: {
    [key in NetworkType]?: string[];
  };
}

export interface ICryptoCurrencyItem {
  id: number;
  symbol: string;
  image: string;
  totalVolume: number;
  totalSupply: number;
  currentPrice: number;
  description: string;
  supportEtransfer: boolean;
  collected: boolean;
  priceChangePercentage24HInCurrency: number;
  priceChangePercentage24H: number;
  marketCap: number;
  lastUpdated: string;
}
export type IMarketType = 'Favorites' | 'Hot' | 'Trending';
export type IMarketSort = 'marketCap' | 'symbol' | 'currentPrice' | 'percentChange24h' | '';
export type IMarketSortDir = 'asc' | 'desc' | '';
export interface IMarketInfo {
  type: IMarketType;
  sort: IMarketSort;
  sortDir: IMarketSortDir;
  dataList: ICryptoCurrencyItem[];
}
export interface IMarketSortAndDir {
  sort: IMarketSort;
  sortDir: IMarketSortDir;
}
export interface IPreMarketSelectedInfo {
  sort: IMarketSort;
  sortDir: IMarketSortDir;
}

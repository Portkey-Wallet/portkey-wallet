export type IEntranceModuleName = 'buy' | 'sell' | 'bridge' | 'eTransDeposit' | 'eTransWithdraw';
export type IEntranceMatchKey = 'version' | 'installationTime' | 'deviceType';
export type IEntranceMatchRuleType = 'String' | 'BigNumber' | 'Regex';

export type IEntrance = Record<IEntranceModuleName, boolean>;

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

export interface IBaseEntranceItem {
  defaultSwitch: boolean;
  matchList: Array<{
    entranceMatch_id: IEntranceMatchItem;
  }>;
}
export interface IEntranceItem extends IBaseEntranceItem {
  moduleName: {
    value: IEntranceModuleName;
  };
}
export type IEntranceMatchValueConfig = Partial<Record<IEntranceMatchKey, string | (() => Promise<string>)>>;
export type IEntranceMatchValueMap = Partial<Record<IEntranceMatchKey, string>>;

type TLoginMode = 'Email' | 'Phone' | 'Apple' | 'Google' | 'Telegram' | 'Twitter' | 'Facebook';

export interface ILoginModeItem extends IBaseEntranceItem {
  extensionIndex: number;
  iOSIndex: number;
  androidIndex: number;
  extensionRecommend?: boolean;
  iOSRecommend?: boolean;
  androidRecommend?: boolean;
  type: TLoginMode;
}

export type TLoginModeIndexKey = keyof Pick<ILoginModeItem, 'extensionIndex' | 'iOSIndex' | 'androidIndex'>;
export type TLoginModeRecommendKey = keyof Pick<
  ILoginModeItem,
  'extensionRecommend' | 'iOSRecommend' | 'androidRecommend'
>;

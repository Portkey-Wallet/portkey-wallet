import { LOGIN_TYPE_LABEL_MAP } from '@portkey-wallet/constants/verifier';

export type IEntranceModuleName = 'buy' | 'sell' | 'bridge' | 'eTransDeposit' | 'eTransWithdraw' | 'swap';
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
  description?: string;
};

export type IMatchListItem = {
  entranceMatch_id?: IEntranceMatchItem;
  loginModeMatch_id?: IEntranceMatchItem;
};

export interface IBaseEntranceItem {
  defaultSwitch: boolean;
  matchList: Array<IMatchListItem>;
}
export interface IEntranceItem extends IBaseEntranceItem {
  moduleName: {
    value: IEntranceModuleName;
  };
}

export type IEntranceMatchValueConfig = Partial<Record<IEntranceMatchKey, string | (() => Promise<string>)>>;
export type IEntranceMatchValueMap = Partial<Record<IEntranceMatchKey, string>>;

export type TLoginMode = typeof LOGIN_TYPE_LABEL_MAP[keyof typeof LOGIN_TYPE_LABEL_MAP];

type TCMSLoginMode = {
  label?: string;
  value?: TLoginMode;
};

export interface ILoginModeItem extends IBaseEntranceItem {
  extensionIndex: number;
  iOSIndex: number;
  androidIndex: number;
  extensionRecommend: boolean;
  iOSRecommend: boolean;
  androidRecommend: boolean;
  type?: TCMSLoginMode;
}

export type TLoginModeIndexKey = keyof Pick<ILoginModeItem, 'extensionIndex' | 'iOSIndex' | 'androidIndex'>;
export type TLoginModeRecommendKey = keyof Pick<
  ILoginModeItem,
  'extensionRecommend' | 'iOSRecommend' | 'androidRecommend'
>;

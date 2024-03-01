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
export type IEntranceItem = {
  moduleName: {
    value: IEntranceModuleName;
  };
  defaultSwitch: boolean;
  matchList: Array<{
    entranceMatch_id: IEntranceMatchItem;
  }>;
};
export type IEntranceMatchValueConfig = Partial<Record<IEntranceMatchKey, string | (() => Promise<string>)>>;
export type IEntranceMatchValueMap = Partial<Record<IEntranceMatchKey, string>>;

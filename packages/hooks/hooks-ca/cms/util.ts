import {
  IEntranceItem,
  IEntranceMatchKey,
  IEntranceMatchRuleType,
  IEntranceModuleName,
} from '@portkey-wallet/store/store-ca/cms/types';
import BigNumber from 'bignumber.js';

export type IEntranceShow = Record<IEntranceModuleName, boolean>;
export type IEntranceMatchValueConfig = Partial<Record<IEntranceMatchKey, string | (() => Promise<string>)>>;
export type IEntranceMatchValueMap = Partial<Record<IEntranceMatchKey, string>>;

const createEntranceMatchRule = (type: IEntranceMatchRuleType, params: string): any => {
  switch (type) {
    case 'String':
      return new String(params);
    case 'BigNumber':
      return new BigNumber(params);
    case 'Regex':
      return new RegExp(params);
    default:
      return {};
  }
};

export const DEFAULT_ENTRANCE_SHOW: IEntranceShow = {
  buy: false,
  sell: false,
  bridge: false,
};

export const generateEntranceShow = async (
  config: IEntranceMatchValueConfig,
  entranceList: IEntranceItem[],
): Promise<IEntranceShow> => {
  const matchValueMap: IEntranceMatchValueMap = {};
  for (const key in config) {
    if (Object.prototype.hasOwnProperty.call(config, key)) {
      const value = config[key as IEntranceMatchKey];
      if (typeof value === 'function') {
        try {
          matchValueMap[key as IEntranceMatchKey] = await value();
        } catch (error) {
          console.log('Entrance: generate config error', error);
        }
      }
      if (typeof value === 'string') {
        matchValueMap[key as IEntranceMatchKey] = value;
      }
    }
  }

  const entranceShow: IEntranceShow = {
    ...DEFAULT_ENTRANCE_SHOW,
  };

  (Object.keys(entranceShow) as Array<IEntranceModuleName>).forEach(moduleName => {
    const entranceStrategy = entranceList.find(ele => ele.moduleName.value === moduleName);
    if (!entranceStrategy) return;
    const { defaultSwitch, matchList } = entranceStrategy;
    if (matchList.length === 0) {
      entranceShow[moduleName] = defaultSwitch;
      return;
    }

    let isMatch = false;
    matchList
      // .sort((a, b) => b.entranceMatch_id.weight - a.entranceMatch_id.weight)
      .forEach(ele => {
        if (isMatch) return;
        const { matchRuleList, matchSwitch } = ele.entranceMatch_id;
        if (!Array.isArray(matchRuleList) || matchRuleList.length === 0) return;

        isMatch = matchRuleList.every(rule => {
          const { type, left, opt, right: matchKey } = rule;
          const matchRule = createEntranceMatchRule(type as IEntranceMatchRuleType, left);
          const matchValue = matchValueMap[matchKey as IEntranceMatchKey];

          if (matchRule[opt] && matchValue !== undefined) {
            return matchRule[opt](matchValue);
          }
          return false;
        });

        if (isMatch) {
          entranceShow[moduleName] = matchSwitch;
        }
      });

    if (!isMatch) {
      entranceShow[moduleName] = defaultSwitch;
    }
  });

  return entranceShow;
};

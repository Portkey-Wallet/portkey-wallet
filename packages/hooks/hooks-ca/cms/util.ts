import {
  IEntranceItem,
  IEntranceMatchKey,
  IEntranceMatchRuleType,
  IEntranceMatchValueConfig,
  IEntranceMatchValueMap,
  IEntranceModuleName,
  IEntrance,
} from '@portkey-wallet/types/types-ca/cms';
import BigNumber from 'bignumber.js';
import { getEntrance as getEntranceGraphQL, getCodePushControl } from '@portkey-wallet/graphql/cms/queries';
import { NetworkType } from '@portkey-wallet/types';

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

export const DEFAULT_ENTRANCE_SHOW: IEntrance = {
  buy: false,
  sell: false,
  bridge: false,
  eTransDeposit: false,
  eTransWithdraw: false,
};

export const generateEntranceShow = async (
  config: IEntranceMatchValueConfig,
  entranceList: IEntranceItem[],
): Promise<IEntrance> => {
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

  const entranceShow: IEntrance = {
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

export const getEntrance = async (networkType: NetworkType) => {
  const result = await getEntranceGraphQL(networkType, {
    filter: {
      entranceMatch_id: {
        status: {
          _eq: 'published',
        },
      },
    },
    sort: '-entranceMatch_id.weight',
  });
  if (result.data.entrance) {
    return result.data.entrance;
  }
  throw new Error('getEntrance error');
};

export const getCmsCodePoshControl = async ({
  version,
  label,
  networkType,
  isIOS,
}: {
  version: string;
  label: string;
  networkType: NetworkType;
  isIOS: boolean;
}) => {
  const result = await getCodePushControl(networkType, {
    filter: {
      _and: [{ label: { _icontains: label } }, { label: { _icontains: isIOS ? 'iOS' : 'android' } }],
      version: { _eq: version },
      status: { _eq: 'published' },
    },
  });

  if (!result?.data?.codePushControl?.[0]) throw new Error('getCmsCodePoshControl error');

  return result?.data?.codePushControl?.[0];
};

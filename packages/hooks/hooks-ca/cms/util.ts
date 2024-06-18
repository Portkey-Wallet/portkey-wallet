import {
  IEntranceItem,
  IEntranceMatchKey,
  IEntranceMatchRuleType,
  IEntranceMatchValueConfig,
  IEntranceMatchValueMap,
  IEntranceModuleName,
  IEntrance,
  IBaseEntranceItem,
  ILoginModeItem,
  TLoginModeIndexKey,
  TLoginModeRecommendKey,
  IMatchListItem,
  TLink,
  TLinkType,
} from '@portkey-wallet/types/types-ca/cms';
import BigNumber from 'bignumber.js';
import { getEntrance as getEntranceGraphQL, getCodePushControl } from '@portkey-wallet/graphql/cms/queries';
import { NetworkType } from '@portkey-wallet/types';
import { VersionDeviceType } from '@portkey-wallet/types/types-ca/device';
import { isExtension } from '@portkey-wallet/utils';
import 'query-string';

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
  swap: false,
  freeMintNft: false,
};

const checkIsEntranceShow = (
  item: IBaseEntranceItem,
  matchValueMap: IEntranceMatchValueMap,
  keyName: keyof IMatchListItem = 'entranceMatch_id',
) => {
  const { defaultSwitch, matchList } = item;

  let matchValue = defaultSwitch;

  if (matchList?.length === 0) return defaultSwitch;

  for (let i = 0; i < matchList.length; i++) {
    const ele = matchList[i];
    const { matchRuleList, matchSwitch } = ele[keyName] || {};

    if (!matchRuleList && !matchSwitch) return defaultSwitch;

    if (!Array.isArray(matchRuleList) || matchRuleList.length === 0) continue;

    const isMatch = matchRuleList.every(rule => {
      const { type, left, opt, right: matchKey } = rule;
      const matchRule = createEntranceMatchRule(type as IEntranceMatchRuleType, left);
      const matchValue = matchValueMap[matchKey as IEntranceMatchKey];

      if (matchRule[opt] && matchValue !== undefined) {
        return matchRule[opt](matchValue);
      }
      return false;
    });

    if (isMatch) {
      matchValue = !!matchSwitch;
      break;
    }
  }

  return matchValue;
};

export const generateMatchValueMap = async (config: IEntranceMatchValueConfig) => {
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
      if (typeof value === 'string') matchValueMap[key as IEntranceMatchKey] = value;
    }
  }
  return matchValueMap;
};

export const generateEntranceShow = async (
  config: IEntranceMatchValueConfig,
  entranceList: IEntranceItem[],
): Promise<IEntrance> => {
  const matchValueMap = await generateMatchValueMap(config);

  const entranceShow: IEntrance = { ...DEFAULT_ENTRANCE_SHOW };

  (Object.keys(entranceShow) as Array<IEntranceModuleName>).forEach(moduleName => {
    const entranceStrategy = entranceList.find(ele => ele.moduleName.value === moduleName);
    if (!entranceStrategy) return;
    entranceShow[moduleName] = checkIsEntranceShow(entranceStrategy, matchValueMap);
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

const LoginModeKeys = {
  [VersionDeviceType.Android]: 'android',
  [VersionDeviceType.Extension]: 'extension',
  [VersionDeviceType.iOS]: 'iOS',
};

export const parseLoginModeList = (
  loginModeList: ILoginModeItem[],
  matchValueMap: IEntranceMatchValueMap,
  deviceType: VersionDeviceType,
) => {
  const key = LoginModeKeys[deviceType];
  const indexKey = `${key}Index` as TLoginModeIndexKey;

  return loginModeList
    .filter(item => checkIsEntranceShow(item, matchValueMap, 'loginModeMatch_id'))
    .sort((a, b) => (a[indexKey] as number) - (b[indexKey] as number));
};

export const sortLoginModeListToAll = (loginModeList: ILoginModeItem[], deviceType: VersionDeviceType) => {
  const key = LoginModeKeys[deviceType];
  const indexKey = `${key}Index` as TLoginModeIndexKey;
  return loginModeList.sort((a, b) => a[indexKey] - b[indexKey]);
};

export const filterLoginModeListToRecommend = (loginModeList: ILoginModeItem[], deviceType: VersionDeviceType) => {
  const key = LoginModeKeys[deviceType];
  const recommendKey = `${key}Recommend` as TLoginModeRecommendKey;
  const indexKey = `${key}Index` as TLoginModeIndexKey;

  return loginModeList.filter(item => item[recommendKey]).sort((a, b) => a[indexKey] - b[indexKey]);
};

export const filterLoginModeListToOther = (loginModeList: ILoginModeItem[], deviceType: VersionDeviceType) => {
  const key = LoginModeKeys[deviceType];
  const recommendKey = `${key}Recommend` as TLoginModeRecommendKey;
  const indexKey = `${key}Index` as TLoginModeIndexKey;

  return loginModeList.filter(item => !item[recommendKey]).sort((a, b) => a[indexKey] - b[indexKey]);
};

// export function parseLink(link: string, defaultUrl?: string): TLink {
//   console.log('wfs link is===', link);
//   if (!link) {
//     return {
//       type: isExtension() ? 'external' : 'internal',
//       location: defaultUrl || '',
//       params: {},
//     };
//   }
//   const protocolMatch = link.match(/^(.*):\/\/(external|internal|native)?/);
//   console.log('protocolMatch is', protocolMatch);
//   const type = protocolMatch && protocolMatch[2] ? protocolMatch[2] : 'internal';
//   const rest = protocolMatch ? link.slice(protocolMatch[0].length) : link;
//   const locationMatch = rest.match(/location=([^&]*)/);
//   const location = locationMatch ? decodeURIComponent(locationMatch[1]) : defaultUrl || '';
//   console.log('location', location);
//   const paramsMatch = rest.match(/params=([^&]*)/);
//   const params = paramsMatch ? JSON.parse(decodeURIComponent(paramsMatch[1])) : {};
//   console.log('wfs parseLink is===', {
//     type: type as TLinkType,
//     location,
//     params,
//   });
//   return {
//     type: type as TLinkType,
//     location,
//     params,
//   };
// }
// export function parseLink(link?: string, defaultUrl?: string): TLink {
//   if (!link) {
//     return {
//       type: isExtension() ? 'external' : 'internal',
//       location: defaultUrl || '',
//       params: {},
//     };
//   }
//   const protocolMatch = link.match(/^portkey:\/\/(external|internal|native)\?/);
//   const type = protocolMatch ? protocolMatch[1] : 'internal'; // 默认为internal

//   const queryString = link.split('?')[1];
//   const queryParams = new URLSearchParams(queryString);
//   const location = queryParams.get('location') || '';
//   let params = {};

//   const paramsString = queryParams.get('params');
//   if (paramsString) {
//     try {
//       params = JSON.parse(decodeURIComponent(paramsString));
//     } catch (error) {
//       console.error('parse failed:', error);
//     }
//   }

//   return {
//     type,
//     location,
//     params,
//   };
// }
export function parseLink(link?: string, defaultUrl?: string): TLink {
  console.log('parseLink===', link, 'defaultUrl', defaultUrl);
  if (!link) {
    return {
      type: isExtension() ? 'external' : 'internal',
      location: defaultUrl || '',
      params: {},
    };
  }
  const protocolMatch = link.match(/^portkey:\/\/(external|internal|native)\?/);
  const type = protocolMatch ? (protocolMatch[1] as TLinkType) : 'external'; // 默认为internal

  const queryString = link.split('?')[1] || '';
  const queryParams = queryString.split('&').reduce((acc, current) => {
    const [key, value] = current.split('=');
    if (key && value) {
      acc[key] = decodeURIComponent(value);
    }
    return acc;
  }, {} as { [key: string]: string });
  const location = queryParams['location'] || '';
  const paramsObj = Object.keys(queryParams).reduce((acc, key) => {
    if (key !== 'location') {
      acc[key] = queryParams[key];
    }
    return acc;
  }, {} as { [key: string]: string });
  let params;
  if (isExtension()) {
    params = paramsObj.params;
  } else {
    try {
      params = JSON.parse(paramsObj.params);
    } catch (e) {
      params = {};
    }
  }
  console.log('parseLink===result', {
    type,
    location,
    params,
  });
  return {
    type,
    location,
    params,
  };
}

import { NetworkItem } from '@portkey-wallet/types/types-ca/network';
import { BackEndNetWorkMap } from './backend-network';
import { LINK_PATH_ENUM } from './link';

export const NetworkList: NetworkItem[] = [
  BackEndNetWorkMap['back-end-test2-ip'],
  BackEndNetWorkMap['back-end-test1-ip'],
];

export const DefaultChainId = 'AELF';

export const OfficialWebsite = 'https://portkey.finance';
export const BingoGame = 'http://192.168.66.240:3000';

export const ThirdParty = `https://openlogin-test.portkey.finance`;

export const LinkPortkeyWebsite = 'https://portkey-website-dev.vercel.app';

export const LinkPortkeyPath = {
  addContact: LinkPortkeyWebsite + LINK_PATH_ENUM.addContact,
  addGroup: LinkPortkeyWebsite + LINK_PATH_ENUM.addGroup,
};

export enum DappMap {
  bridge = 'http://192.168.67.173:3000',
}
const EBridgeList = NetworkList.map(i => i.eBridgeUrl).filter(i => !!i) as string[];
const ETransList = NetworkList.map(i => i.eTransUrl).filter(i => !!i) as string[];
export const DAPP_WHITELIST: string[] = [...EBridgeList, ...ETransList];

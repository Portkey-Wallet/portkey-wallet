import { NetworkItem } from '@portkey-wallet/types/types-ca/network';
import { BackEndNetWorkMap } from './backend-network';
import { LINK_PATH_ENUM } from './link';

export const NetworkList: NetworkItem[] = [BackEndNetWorkMap['back-end-test3'], BackEndNetWorkMap['back-end-test1']];

export const DefaultChainId = 'AELF';

export const OfficialWebsite = 'https://portkey.finance';

export const BingoGame = 'http://192.168.66.240:3000';

export const ThirdParty = `https://openlogin-test.portkey.finance`;

export enum DappMap {
  bridge = 'http://192.168.67.173:3000',
}
export const DAPP_WHITELIST: string[] = [DappMap.bridge];

export const LinkPortkeyWebsite = 'https://portkey-website-dev.vercel.app';
export const LinkPortkeyPath = {
  addContact: LinkPortkeyWebsite + LINK_PATH_ENUM.addContact,
  addGroup: LinkPortkeyWebsite + LINK_PATH_ENUM.addGroup,
};

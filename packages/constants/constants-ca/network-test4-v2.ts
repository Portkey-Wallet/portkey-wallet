import { NetworkItem } from '@portkey-wallet/types/types-ca/network';
import { BackEndNetWorkMap } from './backend-network';
import { LINK_PATH_ENUM } from './link';

export const NetworkList: NetworkItem[] = [
  BackEndNetWorkMap['back-end-test4-v2'],
  BackEndNetWorkMap['back-end-test3-v2'],
];

export const DefaultChainId = 'AELF';

export const OfficialWebsite = 'https://portkey.finance';

export const ThirdParty = `https://openlogin-test.portkey.finance`;

export const LinkPortkeyWebsite = 'https://portkey-website-dev.vercel.app';

export const LinkPortkeyPath = {
  addContact: LinkPortkeyWebsite + LINK_PATH_ENUM.addContact,
  addGroup: LinkPortkeyWebsite + LINK_PATH_ENUM.addGroup,
};

const EBridgeList = NetworkList.map(i => i.eBridgeUrl).filter(i => !!i) as string[];
const ETransferList = NetworkList.map(i => i.eTransferUrl).filter(i => !!i) as string[];
export const DAPP_WHITELIST: string[] = [...EBridgeList, ...ETransferList];

export enum DappMap {
  bridge = 'http://192.168.67.173:3000',
}

export const OpenLogin = `https://openlogin-test.portkey.finance`;

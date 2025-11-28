import { NetworkItem } from '@portkey-wallet/types/types-ca/network';
import { BackEndNetWorkMap } from './backend-network';
import { LINK_PATH_ENUM } from './link';
import { T_ENV_NAME } from '@portkey-wallet/types';

export const NetworkList: NetworkItem[] = [
  BackEndNetWorkMap['back-end-test2-ip'],
  BackEndNetWorkMap['back-end-test1-ip'],
];

export const DefaultChainId = 'AELF';

export const OfficialWebsite = 'https://portkey.finance';
export const BingoGame = 'http://192.168.66.240:3000';

export const ThirdParty = `https://openlogin-test.portkey.finance`;

export const OpenLogin = `https://openlogin-test.portkey.finance`;

export const LinkPortkeyWebsite = 'https://portkey-website-dev.vercel.app';

export const LinkPortkeyPath = {
  addContact: LinkPortkeyWebsite + LINK_PATH_ENUM.addContact,
  addGroup: LinkPortkeyWebsite + LINK_PATH_ENUM.addGroup,
};

const EBridgeList = NetworkList.map(i => i.eBridgeUrl).filter(i => !!i) as string[];
const ETransferList = NetworkList.map(i => i.eTransferUrl).filter(i => !!i) as string[];
export const DAPP_WHITELIST: string[] = [...EBridgeList, ...ETransferList];

export const ENV_NAME: T_ENV_NAME = 'offline';

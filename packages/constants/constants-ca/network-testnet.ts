import { NetworkItem } from '@portkey-wallet/types/types-ca/network';
import { BackEndNetWorkMap } from './backend-network';
import { LINK_PATH_ENUM } from './link';
import { T_ENV_NAME } from '@portkey-wallet/types';
export const NetworkList: NetworkItem[] = [
  BackEndNetWorkMap['back-end-mainnet'],
  BackEndNetWorkMap['back-end-testnet'],
];

export const DefaultChainId = 'AELF';

export const OfficialWebsite = 'https://portkey.finance';

export const BingoGame = 'https://portkey-bingo-game.vercel.app';
export const ThirdParty = `https://thirdparty.portkey.finance`;
export const OpenLogin = `https://openlogin.portkey.finance`;

const EBridgeList = NetworkList.map(i => i.eBridgeUrl).filter(i => !!i) as string[];
const ETransferList = NetworkList.map(i => i.eTransferUrl).filter(i => !!i) as string[];
const AwakenUrlList = NetworkList.map(i => i.awakenUrl).filter(i => !!i) as string[];
const SchrodingerList = NetworkList.map(i => i.schrodingerUrl).filter(i => !!i) as string[];
const SGRSchrodingerList = NetworkList.map(i => i.sgrSchrodingerUrl).filter(i => !!i) as string[];
const ReferralList = NetworkList.map(i => i.referralUrl).filter(i => !!i) as string[];
const ForestUrlList = NetworkList.map(i => i.eForestUrl).filter(i => !!i) as string[];

export const DAPP_WHITELIST: string[] = [
  ...EBridgeList,
  ...ETransferList,
  ...AwakenUrlList,
  ...SchrodingerList,
  ...SGRSchrodingerList,
  ...ReferralList,
  ...ForestUrlList,
];

export const LinkPortkeyWebsite = OfficialWebsite;
export const LinkPortkeyPath = {
  addContact: LinkPortkeyWebsite + LINK_PATH_ENUM.addContact,
  addGroup: LinkPortkeyWebsite + LINK_PATH_ENUM.addGroup,
};

export const ENV_NAME: T_ENV_NAME = 'online';

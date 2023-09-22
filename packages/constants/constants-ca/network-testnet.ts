import { NetworkItem } from '@portkey-wallet/types/types-ca/network';
import { BackEndNetWorkMap } from './backend-network';
import { LINK_PATH_ENUM } from './link';
export const NetworkList: NetworkItem[] = [
  BackEndNetWorkMap['back-end-mainnet'],
  BackEndNetWorkMap['back-end-testnet'],
];

export const DefaultChainId = 'AELF';

export const OfficialWebsite = 'https://portkey.finance';

export const BingoGame = 'https://portkey-bingo-game.vercel.app';
export const ThirdParty = `https://thirdparty.portkey.finance`;

export const LinkPortkeyWebsite = OfficialWebsite;

export const LinkPortkeyPath = {
  addContact: LinkPortkeyWebsite + LINK_PATH_ENUM.addContact,
  addGroup: LinkPortkeyWebsite + LINK_PATH_ENUM.addGroup,
};

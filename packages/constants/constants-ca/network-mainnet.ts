import { NetworkItem } from '@portkey-wallet/types/types-ca/network';
import { BackEndNetWorkMap } from './backend-network';

export const NetworkList: NetworkItem[] = [
  BackEndNetWorkMap['back-end-mainnet'],
  BackEndNetWorkMap['back-end-testnet'],
];

export const DefaultChainId = 'AELF';

export const OfficialWebsite = 'https://portkey.finance';
export const BingoGame = 'https://portkey-bingo-game.vercel.app';

export const ThirdParty = `https://thirdparty.portkey.finance`;

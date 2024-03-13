import { NetworkItem } from 'packages/types/types-ca/network';
import { BackEndNetWorkMap } from './backend-network';

export const NetworkList: NetworkItem[] = [
  BackEndNetWorkMap['back-end-mainnet-v2'],
  BackEndNetWorkMap['back-end-testnet-v2'],
];

export const DefaultChainId = 'AELF';

export const OfficialWebsite = 'https://portkey.finance';
export const BingoGame = 'https://portkey-bingo-game.vercel.app';

export const ThirdParty = `https://thirdparty.portkey.finance`;

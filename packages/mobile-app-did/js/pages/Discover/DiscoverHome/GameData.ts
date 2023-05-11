import { BingoGame } from '@portkey-wallet/constants/constants-ca/network';
import { IGameListItemType } from '@portkey-wallet/types/types-ca/discover';

export const GamesList: IGameListItemType[] = [
  {
    title: 'Bingo Game',
    label: 'Bingo Game',
    name: 'Bingo Game',
    imgUrl: '@portkey-wallet/assets/images/bingo.png',
    pngName: 'bingoGame',
    introduction: 'An on-chain big and small betting game',
    url: BingoGame,
  },
];

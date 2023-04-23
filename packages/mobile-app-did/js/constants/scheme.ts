export const DID_SCHEME = 'portkey.did';

export enum SCHEME_ACTION {
  login = 'login',
}

export enum AUTH_LOGIN_TYPE {
  'BingoGame' = 'BingoGame',
}

export const AUTH_LOGIN_MAP = {
  [AUTH_LOGIN_TYPE.BingoGame]: {
    label: 'BingoGame',
    imgUrl: require('assets/image/pngs/bingoGame.png'),
  },
};

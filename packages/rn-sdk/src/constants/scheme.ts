export const DID_SCHEME = 'portkey.did';

export enum SCHEME_ACTION {
  login = 'login',
  linkDapp = 'linkDapp',
}

export enum AUTH_LOGIN_TYPE {
  'Bingogame' = 'Bingogame',
  'Other' = 'Other',
}

export const AUTH_LOGIN_MAP = {
  [AUTH_LOGIN_TYPE.Bingogame]: {
    label: 'Bingogame',
    imgUrl: require('assets/image/pngs/bingoGame.png'),
  },
  [AUTH_LOGIN_TYPE.Other]: {
    label: 'Other',
    imgUrl: require('assets/image/pngs/default_record.png'),
  },
};

export const AUTH_LOGIN_TYPE_LIST = Object.values(AUTH_LOGIN_TYPE);

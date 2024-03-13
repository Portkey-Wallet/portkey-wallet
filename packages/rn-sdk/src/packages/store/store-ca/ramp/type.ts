import { IRampCryptoDefault, IRampCryptoItem, IRampFiatDefault, IRampFiatItem } from 'packages/ramp';

export interface IRampStateType {
  rampEntry: IRampEntry;
  buyFiatList: IRampFiatItem[];
  buyDefaultFiat: IRampFiatDefault;
  buyDefaultCryptoList: IRampCryptoItem[];
  buyDefaultCrypto: IRampCryptoDefault;
  sellCryptoList: IRampCryptoItem[];
  sellDefaultCrypto: IRampCryptoDefault;
  sellDefaultFiatList: IRampFiatItem[];
  sellDefaultFiat: IRampFiatDefault;
}

export interface IRampEntry {
  isRampShow: boolean;
  isBuySectionShow: boolean;
  isSellSectionShow: boolean;
}

// TODO need to delete?
export interface GetFiatType {
  currency: string; // 3 letters fiat code
  country: string; // 2 letters region code
  payWayCode: string; // code of payment
  payWayName: string; // name of payment
  fixedFee: number | string; // ramp flat rate
  rateFee?: number | string; // ramp percentage rate
  payMin: number | string;
  payMax: number | string;
}

// TODO need to delete?
export interface FiatType extends GetFiatType {
  countryName?: string;
  icon?: string;
}

// TODO need to delete?
export interface AchTokenInfoType {
  token: string;
  expires: number;
}

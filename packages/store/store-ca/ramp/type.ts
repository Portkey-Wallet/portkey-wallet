import { IRampCryptoDefault, IRampCryptoItem, IRampFiatDefault, IRampFiatItem, IRampInfo } from '@portkey-wallet/ramp';

export interface IRampStateType {
  rampInfo: IRampInfo;
  rampEntry: IRampEntry;
  buyCryptoList: IRampCryptoItem[];
  buyFiatList: IRampFiatItem[];
  buyDefaultCrypto: IRampCryptoDefault;
  buyDefaultFiat: IRampFiatDefault;
  sellCryptoList: IRampCryptoItem[];
  sellFiatList: IRampFiatItem[];
  sellDefaultCrypto: IRampCryptoDefault;
  sellDefaultFiat: IRampFiatDefault;
}

export interface IRampEntry {
  isRampShow: boolean;
  isBuySectionShow: boolean;
  isSellSectionShow: boolean;
}

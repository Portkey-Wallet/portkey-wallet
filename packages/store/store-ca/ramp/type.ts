import { IRampCryptoDefault, IRampCryptoItem, IRampFiatDefault, IRampFiatItem, IRampInfo } from '@portkey-wallet/ramp';

export interface IRampStateType {
  rampInfo: IRampInfo;
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

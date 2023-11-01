import { IRampCryptoDefault, IRampCryptoItem, IRampFiatDefault, IRampFiatItem, IRampInfo } from '@portkey-wallet/ramp';

export interface IRampStateType {
  rampInfo: IRampInfo;
  rampEntry: IRampEntry;
  buyFiatList: IRampFiatItem[];
  buyDefaultCrypto: IRampCryptoDefault;
  buyDefaultFiat: IRampFiatDefault;
  sellCryptoList: IRampCryptoItem[];
  sellDefaultCrypto: IRampCryptoDefault;
  sellDefaultFiat: IRampFiatDefault;
}

export interface IRampEntry {
  isRampShow: boolean;
  isBuySectionShow: boolean;
  isSellSectionShow: boolean;
}

export interface GetFiatType {
  currency: string; // 3 letters fiat code
  country: string; // 2 letters region code
  payWayCode: string; // code of payment
  payWayName: string; // name of payment
  fixedFee: number; // ramp flat rate
  rateFee: number; // ramp percentage rate
  payMin: number;
  payMax: number;
}

export interface FiatType extends GetFiatType {
  countryName?: string;
  icon?: string;
}

export interface AchTokenInfoType {
  token: string;
  expires: number;
}
export interface PaymentStateType {
  buyFiatList: FiatType[];
  sellFiatList: FiatType[];
  achTokenInfo?: AchTokenInfoType;
}

export interface OrderQuoteType {
  crypto: string;
  cryptoPrice: string;
  cryptoQuantity?: string;
  fiat: string;
  rampFee: string;
  networkFee: string;
  fiatQuantity?: string;
}

export interface CryptoInfoType {
  crypto: string;
  network: string;
  buyEnable: string;
  sellEnable: string;
  minPurchaseAmount: number | null;
  maxPurchaseAmount: number | null;
  address: null;
  icon: string;
  minSellAmount: number | null;
  maxSellAmount: number | null;
}

export interface GetAchTokenDataType {
  id: string;
  email: string;
  accessToken: string;
}

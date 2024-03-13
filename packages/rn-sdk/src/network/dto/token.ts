export interface TokenPriceItem {
  symbol: string;
  priceInUsd: number;
}

export interface TokenPriceResult {
  items: TokenPriceItem[];
  totalRecordCount: number;
}

export type RateItem = {
  symbol: string; //ELF
  USD: string | number;
  BTC?: string | number;
  CNY?: string | number;
  [key: string]: any;
};

export type RateKey = string; // token symbol + token address     eg: ELF&ArPnUb5FtxG2oXTaWX2DxNZowDEruJLs2TEkhRCzDdrRDfg8B

export type RateInfo = Record<RateKey, RateItem>;

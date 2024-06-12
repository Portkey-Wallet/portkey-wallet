export enum CryptoGiftStatus {
  Active = 'Active',
  Claimed = 'Claimed',
  Expired = 'Expired',
}

export enum CryptoGiftOriginalStatus {
  Init = 0,
  NotClaimed = 1,
  Claimed = 2,
  FullyClaimed = 3,
  Expired = 4,
  Cancelled = 5,
}

export type CryptoGiftItem = {
  id: string;
  totalAmount: number;
  grabbedAmount: number;
  decimal: number;
  memo: string;
  status: CryptoGiftStatus;
  redPackageStatus: CryptoGiftOriginalStatus;
  symbol: string;
  createTime: number;
};

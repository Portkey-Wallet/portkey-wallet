export enum CryptoGiftStatus {
  Active = 'Active',
  Claimed = 'Claimed',
  Expired = 'Expired',
}

export enum CryptoGiftOriginalStatus {
  Init = 'Init',
  NotClaimed = 'NotClaimed',
  Claimed = 'Claimed',
  FullyClaimed = 'FullyClaimed',
  Expired = 'Expired',
  Cancelled = 'Cancelled',
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

export enum CryptoGiftStatus {
  InProgress = 'In Progress',
  FullyClaimed = 'Fully Claimed',
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
  totalAmount: number;
  grabbedAmount: number;
  decimal: number;
  memo: string;
  status: CryptoGiftStatus;
  redPackageStatus: CryptoGiftOriginalStatus;
  symbol: string;
  createTime: number;
};

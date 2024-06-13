export enum CryptoGiftStatus {
  Active = 'Active',
  Claimed = 'All claimed',
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
  exist?: boolean;
  id: string;
  totalAmount: number;
  grabbedAmount: number;
  decimal: number;
  memo: string;
  displayStatus: CryptoGiftStatus;
  status: CryptoGiftOriginalStatus;
  symbol: string;
  createTime: number;
};

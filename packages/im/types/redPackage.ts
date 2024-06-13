import { AssetType } from '@portkey-wallet/constants/constants-ca/assets';
import { ChainId } from '.';
import { SeedTypeEnum } from '@portkey-wallet/types/types-ca/assets';
import { CryptoGiftOriginalStatus, CryptoGiftStatus } from '@portkey-wallet/types/types-ca/cryptogift';

export type RedPackageStatusInfo = {
  viewStatus: RedPackageStatusEnum;
};

export enum RedPackageCreationStatusEnum {
  PENDING = 0,
  SUCCESS = 1,
  FAIL = 2,
}

export enum RedPackageTypeEnum {
  P2P = 1,
  RANDOM = 2,
  FIXED = 3,
}

export enum RedPackageStatusEnum {
  UNOPENED = 1,
  OPENED = 2,
  NONE_LEFT = 3,
  EXPIRED = 4,
}

export const redPackagesStatusShowMap = {
  [RedPackageStatusEnum.UNOPENED]: 'Crypto Box',
  [RedPackageStatusEnum.OPENED]: 'Opened',
  [RedPackageStatusEnum.NONE_LEFT]: 'None left',
  [RedPackageStatusEnum.EXPIRED]: 'Expired',
};
export enum DisplayType {
  Common = 0,
  Pending = 1,
}
export type RedPackageDetail = {
  totalCount: number;
  senderId: string;
  senderAvatar: string;
  senderName: string;
  luckKingId?: string;
  createTime: number;
  endTime: number; // The value is 0 if not finished
  expireTime: number;
  totalAmount: string;
  memo: string;
  chainId: ChainId;
  symbol: string;
  decimal: string | number;
  currentUserGrabbedAmount: string;
  grabbedAmount: string;
  isCurrentUserGrabbed: boolean;
  isRedPackageFullyClaimed: boolean;
  isRedPackageExpired: boolean;
  count: number;
  grabbed: number;
  type: RedPackageTypeEnum;
  viewStatus: RedPackageStatusEnum;
  alias: string;
  tokenId: string;
  imageUrl: string;
  assetType: AssetType;
  isSeed?: boolean;
  seedType?: SeedTypeEnum;
  // only for crypto gift
  status?: CryptoGiftOriginalStatus;
  displayStatus: CryptoGiftStatus;
};

export type RedPackageGrabInfoItem = {
  userId: string;
  username: string;
  avatar: string;
  grabTime: number;
  isLuckyKing: boolean;
  amount: string;
  isMe: boolean;
  displayType: DisplayType;
  expirationTime: number;
};

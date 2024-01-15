import { RampType } from '@portkey-wallet/ramp';
import { ChainId } from '@portkey-wallet/types';
import { ActivityItemType } from '@portkey-wallet/types/types-ca/activity';
import { ITransferLimitRouteState } from '@portkey-wallet/types/types-ca/paymentSecurity';
import { TokenItemShowType } from '@portkey-wallet/types/types-ca/token';

export enum FromPageEnum {
  register = 'register',
  login = 'login',
  guardiansAdd = 'guardiansAdd',
  guardiansEdit = 'guardiansEdit',
  guardiansDel = 'guardiansDel',
  guardiansLoginGuardian = 'guardiansLoginGuardian',
  removeManage = 'removeManage',
  setTransferLimit = 'setTransferLimit',
}

// Guardians
export type TGuardiansLocationState = {
  accelerateChainId?: ChainId;
};

// AddGuardian
export type TAddGuardianLocationState = {
  accelerateChainId?: ChainId;
  from?: string;
};

export type TAddGuardianLocationSearch = {
  accelerateChainId?: ChainId;
  from?: string;
};

// GuardianApproval
export enum GuardianApprovalFromPageEnum {
  guardiansAdd = FromPageEnum.guardiansAdd,
  guardiansEdit = FromPageEnum.guardiansEdit,
  guardiansDel = FromPageEnum.guardiansDel,
  guardiansLoginGuardian = FromPageEnum.guardiansLoginGuardian,
  removeManage = FromPageEnum.removeManage,
  setTransferLimit = FromPageEnum.setTransferLimit,
}

export type TGuardianApprovalLocationState = {
  from: GuardianApprovalFromPageEnum;
  targetChainId?: ChainId;
  extra?: string;
  manageAddress?: string;
};

export type TGuardianApprovalLocationSearch = TGuardianApprovalLocationState;

// GuardianRecovery
export enum GuardianRecoveryFromPageEnum {
  guardiansAdd = FromPageEnum.guardiansAdd,
  guardiansEdit = FromPageEnum.guardiansEdit,
  guardiansDel = FromPageEnum.guardiansDel,
  guardiansLoginGuardian = FromPageEnum.guardiansLoginGuardian,
}

export type TGuardianRecoveryLocationState = {
  from: GuardianRecoveryFromPageEnum;
  accelerateChainId?: ChainId;
  extra?: string;
};

// GuardianItem
export enum GuardianItemFromPageEnum {
  guardiansAdd = FromPageEnum.guardiansAdd,
  guardiansEdit = FromPageEnum.guardiansEdit,
  guardiansDel = FromPageEnum.guardiansDel,
  guardiansLoginGuardian = FromPageEnum.guardiansLoginGuardian,
  removeManage = FromPageEnum.removeManage,
  setTransferLimit = FromPageEnum.setTransferLimit,
}

export type TGuardianItemLocationState = {
  from: GuardianItemFromPageEnum;
};

export type TGuardianItemLocationSearch = TGuardianItemLocationState;

// VerifierAccount

export enum VerifierAccountFromPageEnum {
  register = FromPageEnum.register,
  login = FromPageEnum.login,
  guardiansAdd = FromPageEnum.guardiansAdd,
  guardiansEdit = FromPageEnum.guardiansEdit,
  guardiansDel = FromPageEnum.guardiansDel,
  guardiansLoginGuardian = FromPageEnum.guardiansLoginGuardian,
  removeManage = FromPageEnum.removeManage,
  setTransferLimit = FromPageEnum.setTransferLimit,
}

export type TVerifierAccountLocationState = {
  from: VerifierAccountFromPageEnum;
  targetChainId?: ChainId;
  extra?: string;
};

// SetTransferLimit
export type TSetTransferLimitLocationState = ITransferLimitRouteState;

export type TSetTransferLimitLocationSearch = ITransferLimitRouteState;

// RemoveOtherManage
export type TRemoveOtherManageLocationState = {
  manageAddress: string;
};

export type TRemoveOtherManageLocationSearch = TRemoveOtherManageLocationState;

// TransferSettingEdit
export type TTransferSettingEditLocationState = ITransferLimitRouteState & {
  fromSymbol?: string;
};

// TransferSetting
export type TTransferSettingLocationState = ITransferLimitRouteState;

// Transaction
export type ITransactionLocationState = {
  item: ActivityItemType;
  chainId?: string;
  from?: string;
};

// Ramp
export type TRampLocationState = {
  crypto: string;
  network: string;
  fiat: string;
  country: string;
  amount: string;
  side: RampType;
  tokenInfo?: TokenItemShowType;
};

// ChatListSearch
export type TChatListSearchLocationState = {
  search?: string;
};

// MemberList
export type TMemberListLocationState = {
  search?: string;
};

// NewChat
export type TNewChatLocationState = {
  search?: string;
};

// NFT
export type TNFTLocationState = {
  address: string;
  chainId: ChainId;
  symbol: string;
  totalSupply: string;
  collectionName?: string;
  collectionImageUrl?: string;
  tokenId: string;
  imageUrl?: string;
  balance: string;
  alias?: string;
};

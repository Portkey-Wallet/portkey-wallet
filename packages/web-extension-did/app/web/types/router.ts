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
export type TGuardianApprovalFromPage =
  | FromPageEnum.guardiansAdd
  | FromPageEnum.guardiansEdit
  | FromPageEnum.guardiansDel
  | FromPageEnum.guardiansLoginGuardian
  | FromPageEnum.removeManage
  | FromPageEnum.setTransferLimit;

export type TGuardianApprovalLocationState = {
  from: TGuardianApprovalFromPage;
  targetChainId?: ChainId;
  extra?: string;
  manageAddress?: string;
};

export type TGuardianApprovalLocationSearch = TGuardianApprovalLocationState;

// GuardianRecovery
export type TGuardianRecoveryFromPage =
  | FromPageEnum.guardiansAdd
  | FromPageEnum.guardiansEdit
  | FromPageEnum.guardiansDel
  | FromPageEnum.guardiansLoginGuardian;

export type TGuardianRecoveryLocationState = {
  from: TGuardianRecoveryFromPage;
  accelerateChainId?: ChainId;
  extra?: string;
};

// GuardianItem
export type TGuardianItemFromPage =
  | FromPageEnum.guardiansAdd
  | FromPageEnum.guardiansEdit
  | FromPageEnum.guardiansDel
  | FromPageEnum.guardiansLoginGuardian
  | FromPageEnum.removeManage
  | FromPageEnum.setTransferLimit;

export type TGuardianItemLocationState = {
  from: TGuardianItemFromPage;
};

export type TGuardianItemLocationSearch = TGuardianItemLocationState;

// VerifierAccount
export type TVerifierAccountFromPage =
  | FromPageEnum.register
  | FromPageEnum.login
  | FromPageEnum.guardiansAdd
  | FromPageEnum.guardiansEdit
  | FromPageEnum.guardiansDel
  | FromPageEnum.guardiansLoginGuardian
  | FromPageEnum.removeManage
  | FromPageEnum.setTransferLimit;

export type TVerifierAccountLocationState = {
  from: TVerifierAccountFromPage;
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

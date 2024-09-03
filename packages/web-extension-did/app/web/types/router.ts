import { RampType } from '@portkey-wallet/ramp';
import { ChainId } from '@portkey-wallet/types';
import { ActivityItemType } from '@portkey-wallet/types/types-ca/activity';
import { IImInfo } from '@portkey-wallet/types/types-ca/contact';
import { ITransferLimitRouteState } from '@portkey-wallet/types/types-ca/paymentSecurity';
import { BaseToken } from '@portkey-wallet/types/types-ca/token';
import { CaHolderInfo } from '@portkey-wallet/types/types-ca/wallet';
import { CustomAddressItem } from 'pages/Contacts/AddContact';
import { IProfileDetailDataProps } from './Profile';
import { ToAccount, SendStage } from 'pages/Send';
import { BalanceTab } from '@portkey-wallet/constants/constants-ca/assets';
import { GuardianItem } from './guardians';
import { NFTItemBaseType } from '@portkey-wallet/types/types-ca/assets';
import { ReceiveTabEnum } from '@portkey-wallet/constants/constants-ca/send';
import { FreeMintStatus } from '@portkey-wallet/types/types-ca/freeMint';

export enum FromPageEnum {
  register = 'register',
  login = 'login',
  guardiansAdd = 'guardiansAdd',
  guardiansEdit = 'guardiansEdit',
  guardiansDel = 'guardiansDel',
  guardiansLoginGuardian = 'guardiansLoginGuardian',
  removeManage = 'removeManage',
  setTransferLimit = 'setTransferLimit',
  chatSearch = 'chat-search',
  chatList = 'chat-list',
  chatBox = 'chat-box',
  chatBoxGroup = 'chat-box-group',
  chatGroupInfo = 'chat-group-info',
  chatMemberList = 'chat-member-list',
  accountCancelation = 'accountCancelation',
  cryptoGiftHome = 'cryptoGiftHome',
  cryptoGiftHistory = 'cryptoGiftHistory',
  cryptoGiftSuccess = 'cryptoGiftSuccess',
}

// Guardians
export type TGuardiansLocationState = {
  accelerateChainId?: ChainId;
};

// AddGuardian
export type TAddGuardianLocationState = {
  accelerateChainId?: ChainId;
  previousPage?: string;
};

export type TAddGuardianLocationSearch = {
  accelerateChainId?: ChainId;
  previousPage?: string;
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
  previousPage?: TGuardianApprovalFromPage;
  targetChainId?: ChainId;
  accelerateChainId?: ChainId;
  extra?: string;
  manageAddress?: string;
  operationDetails?: string;
};

export type TGuardianApprovalLocationSearch = TGuardianApprovalLocationState;

// GuardianRecovery
export type TGuardianRecoveryFromPage =
  | FromPageEnum.guardiansAdd
  | FromPageEnum.guardiansEdit
  | FromPageEnum.guardiansDel
  | FromPageEnum.guardiansLoginGuardian;

export type TGuardianRecoveryLocationState = {
  previousPage: TGuardianRecoveryFromPage;
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
  previousPage: TGuardianItemFromPage;
  operationDetails?: string;
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
  previousPage?: TVerifierAccountFromPage;
  targetChainId?: ChainId;
  accelerateChainId?: ChainId;
  extra?: string;
  operationDetails?: string;
};

// Account Cancelation Verify Code
export type TVerifyAccountCancelFromPage = FromPageEnum.accountCancelation;
export type TVerifyAccountCancelLocationState = {
  previousPage: TVerifyAccountCancelFromPage;
  verifierSessionId: string;
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
  previousPage?: string;
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
export type TNFTLocationState = NFTItemBaseType & {
  collectionName?: string;
  collectionImageUrl?: string;
};

// SetPin
export type TSetNewPinLocationState = {
  pin: string;
};

// Ramp
export type TRampLocationState = Partial<TRampPreviewLocationState>;

export type TRampPreviewLocationState = {
  crypto: string;
  network: string;
  fiat: string;
  country: string;
  amount: string;
  side: RampType;
  tokenInfo?: TTokenDetailLocationState;
  openGuardiansApprove?: boolean;
  approveList?: GuardianItem[];
  mainPageInfo?: {
    pageName: string;
  };
};

// AddContact
export type TAddContactLocationState = {
  id?: string;
  addresses?: CustomAddressItem[];
  name?: string;
  imInfo?: Partial<IImInfo>;
};

// EditContact
export type TEditContactLocationState = {
  id: string;
  name?: string;
  caHolderInfo?: Partial<CaHolderInfo>;
  isShowRemark?: boolean;
  imInfo?: Partial<IImInfo>;
};

export type TFindMoreFromPage = FromPageEnum.chatSearch | FromPageEnum.chatList;

// FindMore
export type TFindMoreLocationState = {
  search?: string;
  previousPage?: TFindMoreFromPage;
};

// ViewContact
export type TViewContactLocationState = IProfileDetailDataProps & {
  id?: string;
  name?: string;
  portkeyId?: string;
  channelUuid?: string;
  isStranger?: boolean;
  search?: string;
};

// Receive
export type TReceiveLocationState = {
  chainId: ChainId;
  symbol: string;
  balance: string;
  imageUrl: string;
  address: string;
  balanceInUsd?: string;
  decimals: string | number;
  label?: string;
  pageSide?: ReceiveTabEnum;
  extraData?: any;
};

// Send
export type TSendPageType = 'token' | 'nft';
export type TSendLocationState = BaseToken & {
  chainId: ChainId;
  targetChainId?: ChainId;
  toAccount?: ToAccount;
  stage?: SendStage;
  amount?: string;
  balance?: string;
  type?: TSendPageType;
  openGuardiansApprove?: boolean;
};

// RecentDetail
export type TRecentDetailLocationState = {
  chainId: ChainId;
  targetChainId: ChainId;
  targetAddress?: string;
  index?: string;
  name?: string;
  avatar?: string;
};

// TokenDetail
export type TTokenDetailLocationState = {
  symbol: string;
  chainId: ChainId;
  balance: string;
  decimals: number;
  tokenContractAddress: string;
  balanceInUsd?: string;
  imageUrl?: string;
  label?: string;
};

export type TWalletNameFromPage =
  | FromPageEnum.chatBox
  | FromPageEnum.chatBoxGroup
  | FromPageEnum.chatGroupInfo
  | FromPageEnum.chatMemberList;

// WalletName
export type TWalletNameLocationState = {
  previousPage?: TWalletNameFromPage;
  channelUuid?: string;
  search?: string;
};

// HomePage
export type THomePageLocationState = {
  key: BalanceTab;
};

// CryptoGift history detail

export type TCryptoGiftDetailFromPage =
  | FromPageEnum.cryptoGiftHome
  | FromPageEnum.cryptoGiftHistory
  | FromPageEnum.cryptoGiftSuccess;

export type TCryptoGiftDetailLocationState = {
  id: string;
  fromPage: TCryptoGiftDetailFromPage;
};

// CryptoGift create success
export type TCryptoGiftSuccessLocationState = {
  id: string;
};

export type TFreeMintLocationState = {
  itemId: string;
  status: FreeMintStatus;
};

// SecondaryMailbox verify
export type TSecondaryMailboxVerifyState = {
  email: string;
  sessionid: string;
};

export type TSecondaryMailboxEditState = {
  email?: string;
};

export enum TransactionTypes {
  TRANSFER = 'Transfer',
  CROSS_CHAIN_TRANSFER = 'CrossChainTransfer', // CrossChain Transfer
  CROSS_CHAIN_RECEIVE_TOKEN = 'CrossChainReceiveToken',
  SOCIAL_RECOVERY = 'SocialRecovery', // Social Recovery
  ADD_MANAGER = 'AddManagerInfo', // Scan code login
  REMOVE_MANAGER = 'RemoveManagerInfo', // Exist wallet
  CREATE_CA_HOLDER = 'CreateCAHolder', // Create CA address
  ADD_GUARDIAN = 'AddGuardian', // Add guardian
  REMOVE_GUARDIAN = 'RemoveGuardian', // Remove guardian
  UPDATE_GUARDIAN = 'UpdateGuardian', // Edit guardian
  SET_GUARDIAN_FOR_LOGIN = 'SetGuardianForLogin', // Set login account
  UNSET_GUARDIAN_FOR_LOGIN = 'UnsetGuardianForLogin', // Unset login account
  REMOVE_OTHER_MANAGER_INFO = 'RemoveOtherManagerInfo', // Remove device
  CLAIM_TOKEN = 'ClaimToken', // faucet receive transfer
  APPROVE = 'Approve', // BingoGame Approve
  BINGO = 'Bingo', // BingoGame Bingo
  PLAY = 'Play', // BingoGame Play
}

export const transactionTypesForActivityList = [
  TransactionTypes.TRANSFER,
  TransactionTypes.CROSS_CHAIN_TRANSFER,
  // 'CrossChainReceiveToken', // activityListPage do not need this type
  TransactionTypes.SOCIAL_RECOVERY,
  TransactionTypes.ADD_MANAGER,
  TransactionTypes.REMOVE_MANAGER,
  TransactionTypes.CREATE_CA_HOLDER,
  TransactionTypes.ADD_GUARDIAN,
  TransactionTypes.REMOVE_GUARDIAN,
  TransactionTypes.UPDATE_GUARDIAN,
  TransactionTypes.SET_GUARDIAN_FOR_LOGIN,
  TransactionTypes.UNSET_GUARDIAN_FOR_LOGIN,
  TransactionTypes.REMOVE_OTHER_MANAGER_INFO,
  TransactionTypes.CLAIM_TOKEN,
  TransactionTypes.APPROVE,
  TransactionTypes.BINGO,
  TransactionTypes.PLAY,
];

/**
 * According to the TransactionTypes, it is converted into a text for page display.
 * @used ActivityListPage and ActivityDetailPage
 */
export const transactionTypesMap = (type?: TransactionTypes, nftId?: string): string => {
  if (!type) return '';
  let newType: string = TransactionTypes.TRANSFER;
  switch (type) {
    case TransactionTypes.TRANSFER:
    case TransactionTypes.CLAIM_TOKEN:
      newType = TransactionTypes.TRANSFER + (nftId ? ' NFT' : '');
      break;

    case TransactionTypes.CROSS_CHAIN_TRANSFER:
      newType = 'CrossChain Transfer' + (nftId ? ' NFT' : '');
      break;

    case TransactionTypes.SOCIAL_RECOVERY:
      newType = 'Social Recovery';
      break;

    case TransactionTypes.ADD_MANAGER:
      newType = 'Scan code login';
      break;

    case TransactionTypes.REMOVE_MANAGER:
      newType = 'Exit Wallet';
      break;
    case TransactionTypes.CREATE_CA_HOLDER:
      newType = 'Create CA address';
      break;
    case TransactionTypes.ADD_GUARDIAN:
      newType = 'Add guardian';
      break;
    case TransactionTypes.REMOVE_GUARDIAN:
      newType = 'Remove guardian';
      break;
    case TransactionTypes.UPDATE_GUARDIAN:
      newType = 'Edit guardian';
      break;
    case TransactionTypes.SET_GUARDIAN_FOR_LOGIN:
      newType = 'Set login account';
      break;
    case TransactionTypes.UNSET_GUARDIAN_FOR_LOGIN:
      newType = 'Unset login account';
      break;
    case TransactionTypes.REMOVE_OTHER_MANAGER_INFO:
      newType = 'Remove device';
      break;
    case TransactionTypes.APPROVE:
      newType = 'Approve';
      break;
    case TransactionTypes.BINGO:
      newType = 'Bingo';
      break;
    case TransactionTypes.PLAY:
      newType = 'Play';
      break;
  }
  return newType;
};

export const DEFAULT_AMOUNT = 0;
export const DEFAULT_DECIMAL = 8;
export const DEFAULT_DIGITS = 4;

export const ELF_DECIMAL = 8;

export const MAIN_CHAIN_ID = 'AELF';
export const MAIN_CHAIN = 'MainChain';
export const SIDE_CHAIN = 'SideChain';
export const TESTNET = 'TESTNET';
export const TEST_NET = 'Testnet';

export const HIDDEN_TRANSACTION_TYPES = [
  TransactionTypes.SOCIAL_RECOVERY,
  TransactionTypes.ADD_MANAGER,
  TransactionTypes.REMOVE_MANAGER,
];

export const SHOW_FROM_TRANSACTION_TYPES = [
  TransactionTypes.TRANSFER,
  TransactionTypes.CROSS_CHAIN_TRANSFER,
  TransactionTypes.CLAIM_TOKEN,
];

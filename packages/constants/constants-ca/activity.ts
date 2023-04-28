export enum TransactionTypes {
  TRANSFER = 'Transfer',
  CROSS_CHAIN_TRANSFER = 'CrossChainTransfer',
  CROSS_CHAIN_RECEIVE_TOKEN = 'CrossChainReceiveToken',
  SOCIAL_RECOVERY = 'SocialRecovery',
  REMOVE_MANAGER = 'RemoveManagerInfo',
  ADD_MANAGER = 'AddManagerInfo',
}

export const transactionTypes = [
  TransactionTypes.TRANSFER,
  TransactionTypes.CROSS_CHAIN_TRANSFER,
  TransactionTypes.CROSS_CHAIN_RECEIVE_TOKEN,
  TransactionTypes.SOCIAL_RECOVERY,
  TransactionTypes.ADD_MANAGER,
  TransactionTypes.REMOVE_MANAGER,
];

export const transactionTypesForActivityList = [
  TransactionTypes.TRANSFER,
  TransactionTypes.CROSS_CHAIN_TRANSFER,
  // 'CrossChainReceiveToken', // activityListPage do not need this type
  TransactionTypes.SOCIAL_RECOVERY,
  TransactionTypes.ADD_MANAGER,
  TransactionTypes.REMOVE_MANAGER,
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

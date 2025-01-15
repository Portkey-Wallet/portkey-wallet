export enum TransactionTypes {
  TRANSFER = 'Transfer',
  CROSS_CHAIN_TRANSFER = 'CrossChainTransfer', // CrossChain Transfer
  CLAIM_TOKEN = 'ClaimToken', // faucet receive transfer
  TRANSFER_RED_PACKET = 'TransferRedPacket',
  CROSS_CHAIN_RECEIVE = 'ReleaseToken', // CrossChain Receive
  SWAP = 'SwapExactTokensForTokens', // Awaken
  BATCH_BUY_NOW = 'BatchBuyNow',
  DEAL = 'Deal',
  PALY = 'Play',
  ADDTREEPOINTS = 'AddTreePoints',
  JOIN = 'Join',
  PLACEBID = 'PlaceBid',
}

export const DEFAULT_AMOUNT = 0;
export const DEFAULT_DECIMAL = 8;
export const DEFAULT_DIGITS = 4;
export const DEFAULT_NFT_DECIMAL = 0;

export const ELF_DECIMAL = 8;

export const AELF_CHIAN_TYPE = 'aelf';
export const MAIN_CHAIN_ID = 'AELF';
export const MAIN_CHAIN = 'MainChain';
export const SIDE_CHAIN = 'dAppChain';
export const TESTNET = 'TESTNET';
export const TEST_NET = 'Testnet';

export const SHOW_FROM_TRANSACTION_TYPES = [
  TransactionTypes.TRANSFER,
  TransactionTypes.CROSS_CHAIN_TRANSFER,
  TransactionTypes.CLAIM_TOKEN,
  TransactionTypes.TRANSFER_RED_PACKET,
  TransactionTypes.SWAP,
  TransactionTypes.CROSS_CHAIN_RECEIVE,
  TransactionTypes.BATCH_BUY_NOW,
  TransactionTypes.DEAL,
  TransactionTypes.PALY,
  TransactionTypes.ADDTREEPOINTS,
  TransactionTypes.JOIN,
  TransactionTypes.PLACEBID,
];

export const SHOW_DAPP_TRANSACTION_TYPES = [TransactionTypes.SWAP];

export const ON_END_REACHED_THRESHOLD = 0.3;
export const ACTIVITY_PAGE_SIZE = 20;

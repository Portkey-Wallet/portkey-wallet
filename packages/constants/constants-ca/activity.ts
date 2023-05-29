export enum TransactionTypes {
  TRANSFER = 'Transfer',
  CROSS_CHAIN_TRANSFER = 'CrossChainTransfer', // CrossChain Transfer
  CLAIM_TOKEN = 'ClaimToken', // faucet receive transfer
}

export const DEFAULT_AMOUNT = 0;
export const DEFAULT_DECIMAL = 8;
export const DEFAULT_DIGITS = 4;

export const ELF_DECIMAL = 8;

export const MAIN_CHAIN_ID = 'AELF';
export const MAIN_CHAIN = 'MainChain';
export const SIDE_CHAIN = 'SideChain';
export const TESTNET = 'TESTNET';
export const TEST_NET = 'Testnet';

export const SHOW_FROM_TRANSACTION_TYPES = [
  TransactionTypes.TRANSFER,
  TransactionTypes.CROSS_CHAIN_TRANSFER,
  TransactionTypes.CLAIM_TOKEN,
];

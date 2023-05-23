export enum TransactionTypes {
  TRANSFER = 'Transfer',
  CROSS_CHAIN_TRANSFER = 'CrossChainTransfer', // CrossChain Transfer
  CLAIM_TOKEN = 'ClaimToken', // faucet receive transfer
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

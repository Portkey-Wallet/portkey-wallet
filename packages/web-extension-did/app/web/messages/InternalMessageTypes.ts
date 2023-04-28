import aelfMessage from './aelfMessage';
import ethMessage from './ethMessage';
import walletMessage from './walletMessage';

export const NOTIFICATION_NAMES = {
  ACCOUNTS_CHANGED: 'portkey_accountsChanged',
  UNLOCK_STATE_CHANGED: 'portkey_unlockStateChanged',
  CHAIN_CHANGED: 'portkey_chainChanged',
  DISCONNECT: 'portkey_disconnect',
  // TODO
  MESSAGE: 'portkey_message',
};

export const PromptRouteTypes = {
  UNLOCK_WALLET: 'UNLOCK_WALLET',
  BLANK_PAGE: 'BLANK_PAGE',
  REGISTER_WALLET: 'REGISTER_WALLET',
  REGISTER_START_WALLET: 'REGISTER_START_WALLET',
  GET_SIGNATURE: 'GET_SIGNATURE',
  PERMISSION_CONTROLLER: 'PERMISSION_CONTROLLER',
  SWITCH_CHAIN: 'SWITCH_CHAIN',
  CONNECT_WALLET: 'CONNECT_WALLET',
  SIGN_MESSAGE: 'SIGN_MESSAGE',
  EXPAND_FULL_SCREEN: 'EXPAND_FULL_SCREEN',

  // my
  SETTING: 'SETTING',

  // guardians
  ADD_GUARDIANS: 'ADD_GUARDIANS',
  GUARDIANS_VIEW: 'GUARDIANS_VIEW',
  GUARDIANS_APPROVAL: 'GUARDIANS_APPROVAL',
} as const;

export const AelfMessageTypes = aelfMessage;
export const WalletMessageTypes = walletMessage;
export const MethodMessageTypes = {
  GET_WALLET_STATE: 'wallet_getState',
};

export const messageType = Object.assign(ethMessage, AelfMessageTypes, MethodMessageTypes);

export const PortkeyMessageTypes = {
  // SEED
  SET_SEED: 'SET_SEED',
  GET_SEED: 'GET_SEED',
  // Wallet
  LOCK_WALLET: 'LOCK_WALLET',
  REGISTER_WALLET: 'REGISTER_WALLET',
  REGISTER_START_WALLET: 'REGISTER_START_WALLET',
  LOGIN_WALLET: 'LOGIN_WALLET',
  ACTIVE_LOCK_STATUS: 'ACTIVE_LOCK_STATUS',

  OPEN_PROMPT: 'OPEN_PROMPT',
  CLOSE_PROMPT: 'CLOSE_PROMPT',

  CHECK_CONTENT: 'CHECK_CONTENT',
  CHECK_WALLET_STATUS: 'CHECK_WALLET_STATUS',
  EXPAND_FULL_SCREEN: 'EXPAND_FULL_SCREEN',

  OPEN_RECAPTCHA_PAGE: 'OPEN_RECAPTCHA_PAGE',
  SOCIAL_LOGIN: 'SOCIAL_LOGIN',

  // my
  SETTING: 'SETTING',

  // guardians
  ADD_GUARDIANS: 'ADD_GUARDIANS',
  GUARDIANS_VIEW: 'GUARDIANS_VIEW',
  GUARDIANS_APPROVAL: 'GUARDIANS_APPROVAL',
} as const;

/**
 * Custom messages to send and be received by the extension
 */
export const EXTENSION_MESSAGES = {
  CONNECTION_READY: 'CONNECTION_READY',
  READY: 'PORTKEY_DID_EXTENSION_READY',
} as const;

export default Object.assign(PortkeyMessageTypes, PromptRouteTypes);

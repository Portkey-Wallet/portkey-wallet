import { MINUTE } from '../index';

export const SocketUrl = 'http://192.168.66.38:5577/ca';
export const listenList = ['caAccountRegister', 'caAccountRecover', 'onScanLoginSuccess'] as const;
export const queryExpirationTime = 5 * MINUTE;

export const sellListenList = ['onAchTxAddressReceived'] as const;

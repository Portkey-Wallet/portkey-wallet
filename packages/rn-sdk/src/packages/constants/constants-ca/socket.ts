import { MINUTE } from '../index';

export const SocketUrl = 'http://192.168.66.38:5577/ca';
export const queryExpirationTime = 5 * MINUTE;

export const sellListenList = ['onAchTxAddressReceived', 'onOrderTransferredReceived'] as const;

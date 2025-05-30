import { DeviceType } from '@portkey-wallet/types/types-ca/device';
import walletMessage from 'messages/walletMessage';
import { ThirdParty } from '@portkey-wallet/constants/constants-ca/network';

export const prefixCls = 'portkey';
// redux
export const reduxStorageRoot = 'root';
export const reduxToken = 'token';
export const reduxWallet = 'wallet';
export const reduxStorageName = `persist:${reduxStorageRoot}`;
export const reduxStorageToken = `persist:${reduxToken}`;
export const reduxStorageWallet = `persist:${reduxWallet}`;

export const CUSTOM_REHYDRATE = 'CUSTOM_REHYDRATE';

export const WORKER_KEEP_ALIVE_MESSAGE = 'WORKER_KEEP_ALIVE_MESSAGE';
export const ACK_KEEP_ALIVE_MESSAGE = 'ACK_KEEP_ALIVE_MESSAGE';
export const TIME_45_MIN_IN_MS = 45 * 60 * 1000;
export const WORKER_KEEP_ALIVE_INTERVAL = 1000;
export const ACK_KEEP_ALIVE_WAIT_TIME = 60_000;

// device
export const DEVICE_TYPE = (() => {
  if (!navigator?.userAgent) return DeviceType.OTHER;
  const agent = navigator.userAgent.toLowerCase();
  const isMac = /macintosh|mac os x/i.test(navigator.userAgent);
  if (isMac) {
    return DeviceType.MAC;
  }
  if (agent.indexOf('win') >= 0 || agent.indexOf('wow') >= 0) {
    return DeviceType.WINDOWS;
  }
  return DeviceType.OTHER;
})();

// NFT
export const PAGE_SIZE_IN_NFT_ITEM_PROMPT = 6;

// after ach-sell, redirect url, then wake up extension.
export const ACH_WITHDRAW_URL = `${ThirdParty}/extension-bridge?method=${walletMessage.ACH_SELL_REDIRECT}&version=v2`;

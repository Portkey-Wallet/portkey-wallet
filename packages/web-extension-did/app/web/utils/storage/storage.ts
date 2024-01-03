import { reduxStorageName, reduxStorageToken, reduxStorageWallet } from 'constants/index';

const storage = {
  // in background.js
  aelfCrossMeta: 'BG_AELF_CROSSMETA',
  lockTime: 'BG_LOCK_TIME',
  locked: 'BG_LOCKED',
  connections: 'BG_CONNECTIONS',
  lastMessageTime: 'BG_LAST_MESSAGE_TIME',
  openTabsId: 'BG_OPEN_TABS_ID',

  txPayload: 'BG_TX_PAYLOAD', // save send transaction payload params

  // Prompt
  // register wallet
  //  reduxStorageName "persist:" + config.key
  reduxStorageName,
  reduxStorageToken,
  reduxStorageWallet,

  // route state cache
  locationState: 'LOCATION_STATE',
  lastLocationState: 'LAST_LOCATION_STATE',
  popupCloseTime: 'POPUP_CLOSE_TIME',
  portkeyOffRampGuardiansApproveList: 'PORTKEY_OFF_RAMP_GUARDIANS_APPROVE_LIST',
  deviceId: 'DEVICE_ID',
};

export default storage;
// reduxStorageName persist:root
export type StorageKeyType = keyof typeof storage;

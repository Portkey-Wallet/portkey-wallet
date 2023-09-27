export enum ChatOperationsEnum {
  PROFILE = 'Profile',
  MUTE = 'Mute',
  UNMUTE = 'Unmute',
  PIN = 'Pin',
  UNPIN = 'Unpin',
  DELETE_CHAT = 'Delete',
  ADD_CONTACT = 'Add Contact',
  GROUP_INFO = 'Group Info',
  LEAVE_GROUP = 'Leave Group',
}

export const ChatHomeOperationList = [
  {
    label: 'Mute/UnMute',
    operation: ChatOperationsEnum.MUTE,
    toggleOperation: ChatOperationsEnum.UNMUTE,
  },
  {
    label: 'Pin/Unpin',
    operation: ChatOperationsEnum.PIN,
    toggleOperation: ChatOperationsEnum.UNPIN,
  },
  {
    label: 'Delete',
    operation: ChatOperationsEnum.DELETE_CHAT,
  },
] as const;

export const ChatDetailsOperationList = [
  {
    label: 'Profile',
    operation: ChatOperationsEnum.PROFILE,
  },
  {
    label: 'Mute/UnMute',
    operation: ChatOperationsEnum.MUTE,
    toggleOperation: ChatOperationsEnum.UNMUTE,
  },
  {
    label: 'Pin/Unpin',
    operation: ChatOperationsEnum.PIN,
    toggleOperation: ChatOperationsEnum.UNPIN,
  },
  {
    label: 'Delete Chat',
    operation: ChatOperationsEnum.DELETE_CHAT,
  },
  {
    label: 'Add Contact',
    operation: ChatOperationsEnum.ADD_CONTACT,
  },
] as const;

export const ChatTabName = 'Chat';
export const GROUP_INFO_MEMBER_SHOW_LIMITED = 4;
export const UN_SUPPORTED_FORMAT = '[Unsupported format]';
export const ALREADY_JOINED_GROUP_CODE = '13302';
export const NO_LONGER_IN_GROUP = '13108';
export const PIN_LIMIT_EXCEED = '13310';

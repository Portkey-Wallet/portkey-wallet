export enum ChatOperationsEnum {
  PROFILE = 'Profile',
  MUTE = 'Mute',
  UNMUTE = 'Unmute',
  PIN = 'Pin',
  UNPIN = 'Unpin',
  DELETE_CHAT = 'Delete',
  ADD_CONTACT = 'Add Contact',
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

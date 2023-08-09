export enum ChatOperationsEnum {
  PROFILE = 'profile',
  MUTE = 'mute',
  UNMUTE = 'unmute',
  PIN = 'pin',
  UNPIN = 'unPin',
  DELETE_CHAT = 'deleteChat',
  ADD_CONTACT = 'addContact',
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

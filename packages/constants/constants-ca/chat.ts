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

export const ChatTabName: string = 'Chat';
export const GROUP_INFO_MEMBER_SHOW_LIMITED = 4;
export const UN_SUPPORTED_FORMAT = '[Unsupported format]';
export const ALREADY_JOINED_GROUP_CODE = '13302';
export const NO_LONGER_IN_GROUP = '13108';
export const PIN_LIMIT_EXCEED = '13310';

export enum ReportMessageEnum {
  Spam = 1,
  Violence = 2,
  Pornography = 3,
  ChildAbuse = 4,
  Copyright = 5,
  IllegalDrugs = 6,
  PersonalDetails = 7,
  Other = 8,
}

export const ReportMessageList = [
  {
    title: 'Spam',
    value: ReportMessageEnum.Spam,
  },
  {
    title: 'Violence',
    value: ReportMessageEnum.Violence,
  },
  {
    title: 'Pornography',
    value: ReportMessageEnum.Pornography,
  },
  {
    title: 'Child Abuse',
    value: ReportMessageEnum.ChildAbuse,
  },
  {
    title: 'Copyright',
    value: ReportMessageEnum.Copyright,
  },
  {
    title: 'Illegal Drugs',
    value: ReportMessageEnum.IllegalDrugs,
  },
  {
    title: 'Personal Details',
    value: ReportMessageEnum.PersonalDetails,
  },
  {
    title: 'Other',
    value: ReportMessageEnum.Other,
  },
] as const;

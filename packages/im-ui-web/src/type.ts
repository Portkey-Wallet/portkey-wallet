import React from 'react';
import { ChannelStatusEnum, ChannelTypeEnum, Message, MessageType, MessageTypeEnum } from '@portkey-wallet/im';

export interface IChatItemProps {
  id: string | number;
  avatar?: string;
  showLetter?: boolean;
  letter?: string;
  unread?: number;
  className?: string;
  alt?: string;
  title: string;
  subtitle?: string;
  date?: Date;
  dateString?: string;
  channelType?: ChannelTypeEnum;
  muted?: boolean;
  showMute?: boolean;
  pin?: boolean;
  status: ChannelStatusEnum;
  isOwner?: boolean;
  lastMessageType: MessageType;
  onClick?: React.MouseEventHandler;
  onClickMute?: React.MouseEventHandler;
  onClickPin?: React.MouseEventHandler;
  onClickDelete?: React.MouseEventHandler;
}

export interface IChatListProps {
  id: string | number;
  className?: string;
  dataSource: IChatItemProps[];
  hasMore?: boolean;
  onContextMenu?: ChatListEvent;
  onClick?: ChatListEvent;
  onClickMute?: ChatListEvent;
  onClickPin?: ChatListEvent;
  onClickDelete?: ChatListEvent;
  loadMore: () => Promise<void>;
}

export type ChatListEvent = (item: IChatItemProps, index?: number, event?: React.MouseEvent<HTMLElement>) => any;

export type INotSupportMessageType = 'NO-SUPPORT-MSG';

export type IDateSysMessageType = 'DATE-SYS-MSG';

export enum ExtraMessageTypeEnum {
  'NO-SUPPORT-MSG' = 'NO-SUPPORT-MSG',
  'DATE-SYS-MSG' = 'DATE-SYS-MSG',
}

export interface INotSupportMessage extends IMessageEvent {
  key: string;
  id: string;
  from?: string;
  fromName?: string;
  fromAvatar?: string;
  letter?: string;
  position: string;
  showAvatar?: boolean;
  createAt: string;
  type: MessageType;
  subType: INotSupportMessageType;
  parsedContent: string;
  className?: string;
}
export interface IDateSysMessage extends IMessageEvent {
  key: string;
  id: string;
  position: string;
  createAt: string;
  type: MessageType;
  from?: string;
  fromName?: string;
  fromAvatar?: string;
  showAvatar?: boolean;
  className?: string;
  subType: IDateSysMessageType;
  parsedContent: string;
}

export interface IMessageEvent {
  onPinMsg?: React.MouseEventHandler;
  onReplyMsg?: React.MouseEventHandler;
  onDeleteMsg?: React.MouseEventHandler;
  onClickAvatar?: React.MouseEventHandler;
  onClickUrl?: (v: string) => void;
  onClickUnSupportMsg?: () => void;
}
export interface IMessage extends Message, IMessageEvent {
  key: string;
  position: string;
  showAvatar?: boolean;
  dateString?: string;
  className?: string;
  showLetter?: boolean;
  letter?: string;
  subType?: string;
  isAdmin?: boolean;
  isGroup?: boolean;
}

export interface IMessageListProps {
  className?: string;
  customProps?: {
    [key: string]: unknown;
  };
  children?: React.ReactNode;
  isShowChild?: boolean;
  reference: any;
  dataSource: MessageContentType[];
  lockable: boolean;
  toBottomHeight?: String | number;
  downButton?: boolean;
  downButtonBadge?: number;
  hasNext: boolean;
  loading: boolean;
  next?: () => any;
  onScroll?: React.UIEventHandler;
  onDeleteMsg?: MessageListEvent;
  onReplyMsg?: MessageListEvent;
  onPinMsg?: MessageListEvent;
  onClickAvatar?: MessageListEvent;
  onClickUrl?: (v: string) => void;
  onClickUnSupportMsg?: () => void;
  onDownButtonClick?: React.RefObject<HTMLButtonElement>;
}

export type MessageListEvent = (item: MessageContentType, index: number, event: React.MouseEvent<HTMLElement>) => any;

export interface IInputProps {
  autofocus?: boolean;
  reference?: any;
  clear?: Function;
  maxLength?: number;
  maxHeight: number;
  onMaxLengthExceed?: Function;
  onChange?: Function;
  multiline?: boolean;
  autoHeight?: boolean;
  minHeight?: number;
  className?: string;
  leftButtons?: React.ReactNode;
  rightButtons?: React.ReactNode;
  type?: React.HTMLInputTypeAttribute;
  placeholder?: string;
  defaultValue?: string;
  inputStyle?: Object;
  value?: string;
  onCopy?: React.ClipboardEventHandler;
  onCut?: React.ClipboardEventHandler;
  onPaste?: React.ClipboardEventHandler;
  onBlur?: React.FocusEventHandler;
  onFocus?: React.FocusEventHandler;
  onSelect?: React.ReactEventHandler;
  onSubmit?: React.FormEventHandler;
  onReset?: React.FormEventHandler;
  onKeyDown?: React.KeyboardEventHandler;
  onKeyPress?: React.KeyboardEventHandler;
  onKeyUp?: React.KeyboardEventHandler;
}

export interface PopDataProps {
  key: string;
  children: React.ReactNode;
  onClick?: () => void;
}

export interface IInputReplyMsgProps {
  msgType: MessageTypeEnum.IMAGE | MessageTypeEnum.TEXT;
  msgContent: string;
  toName: string;
  onCloseReply?: () => void;
}
export interface IInputBarProps {
  maxLength?: number;
  moreData?: PopDataProps[];
  showEmoji?: boolean;
  replyMsg?: IInputReplyMsgProps;
  onCloseReply?: () => void;
  onSendMessage: (v: string) => void;
}

export interface IPopoverMenuListData {
  key: number | string;
  leftIcon?: React.ReactNode;
  children?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onClick?: (v?: any) => void;
  height?: number;
  className?: string;
}

export interface IPopoverMenuListProps {
  className?: string;
  data?: IPopoverMenuListData[];
}

export type IAvatarSize = 'small' | 'default' | 'large';

export interface IAvatarProps {
  src?: string;
  showLetter?: boolean;
  letter?: string;
  className?: string;
  alt?: string;
  channelType?: ChannelTypeEnum;
  width?: number;
  height?: number;
  avatarSize?: IAvatarSize;
  onClick?: React.MouseEventHandler;
}

export interface IUnreadTipProps {
  unread: number;
  muted?: boolean;
  bgColorString?: string;
}

export type MessageContentType = IMessage | IDateSysMessage | INotSupportMessage;

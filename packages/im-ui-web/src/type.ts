import React from 'react';
import { ChannelItem, Message, MessageType, MessageTypeEnum } from '@portkey-wallet/im';

export type ChatListEvent = (item: IChatItemProps) => any;

export interface IChatItemEvent {
  onClick?: ChatListEvent;
  onClickMute?: ChatListEvent;
  onClickPin?: ChatListEvent;
  onClickDelete?: ChatListEvent;
}

export interface IChatItemProps extends ChannelItem, IChatItemEvent {
  className?: string;
  dateString?: string;
  myPortkeyId?: string;
}

export interface IChatListProps extends IChatItemEvent {
  id: string | number;
  className?: string;
  dataSource: IChatItemProps[];
  hasMore?: boolean;
  myPortkeyId?: string;
  loadMore: () => Promise<void>;
}

export type INotSupportMessageType = 'NO-SUPPORT-MSG';

export type IDateSysMessageType = 'DATE-SYS-MSG';

export enum ExtraMessageTypeEnum {
  'NO-SUPPORT-MSG' = 'NO-SUPPORT-MSG',
  'DATE-SYS-MSG' = 'DATE-SYS-MSG',
}

export interface ICustomMessage {
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
  parsedContent: string;
  className?: string;
  hideAvatar?: boolean;
}

export interface INotSupportMessage extends ICustomMessage, IMessageEvent {
  subType: INotSupportMessageType;
}
export interface IDateSysMessage extends ICustomMessage, IMessageEvent {
  subType: IDateSysMessageType;
}

export interface IMessageEvent {
  onPinMsg?: MessageEvent;
  onReplyMsg?: MessageEvent;
  onDeleteMsg?: MessageEvent;
  onClickAvatar?: MessageEvent;
  onClickUrl?: (v: string) => void;
  onClickUnSupportMsg?: () => void;
  onReportMsg?: MessageEvent;
}

export type IMessageShowPage = 'PIN-PAGE' | 'MSG-PAGE';

export enum MessageShowPageEnum {
  'PIN-PAGE' = 'PIN-PAGE',
  'MSG-PAGE' = 'MSG-PAGE',
}
export interface IMessage extends Message, IMessageEvent {
  key: string;
  position: string;
  showAvatar?: boolean;
  dateString?: string;
  className?: string;
  subType?: string;
  isAdmin?: boolean;
  isGroup?: boolean;
  showPageType?: IMessageShowPage;
  hideAvatar?: boolean;
  myPortkeyId?: string;
}

export interface IMessageListProps extends IMessageEvent {
  className?: string;
  customProps?: {
    [key: string]: unknown;
  };
  children?: React.ReactNode;
  isShowChild?: boolean;
  reference: any;
  dataSource: MessageContentType[];
  lockable: boolean;
  toBottomHeight?: number;
  downButton?: boolean;
  downButtonBadge?: number;
  hasNext: boolean;
  loading: boolean;
  myPortkeyId?: string;
  next?: () => any;
}

export type MessageEvent = (item: MessageContentType) => any;

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
  msgContent?: string;
  thumbImgUrl?: string;
  imgUrl?: string;
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
  svgSrc?: string;
  letter?: string;
  className?: string;
  alt?: string;
  isGroupAvatar?: boolean;
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

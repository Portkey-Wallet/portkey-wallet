import React from 'react';
import { ChannelTypeEnum } from '@portkey-wallet/im';

export interface IChatItemProps {
  id: string | number;
  avatar?: string;
  letterItem?: string;
  unread?: number;
  className?: string;
  alt?: string;
  title: string;
  subtitle?: string;
  date?: Date;
  dateString?: string;
  channelType: ChannelTypeEnum;
  muted?: boolean;
  showMute?: boolean;
  pin?: boolean;
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

export interface IMessage {
  key: string;
  id: string | number;
  position: string;
  text: string;
  title?: string;
  date?: number | string;
  dateString?: string;
  avatar?: string;
  className?: string;
  letterItem?: string;
  type: string;
  onDeleteMsg?: React.MouseEventHandler;
}

export interface IImageMessage extends IMessage {
  imgData?: {
    thumbImgUrl?: string;
    imgUrl?: string;
    width?: string;
    height?: string;
    name?: string;
    size?: number;
    id?: string;
    alt?: string;
  };
}

export interface IImageMessageProps extends IImageMessage {
  onDownload?: React.MouseEventHandler;
  onOpen?: React.MouseEventHandler;
  onLoad?: React.ReactEventHandler;
  onPhotoError?: React.ReactEventHandler;
}

export type ISystemMessage = IMessage;

export type ISystemMessageProps = ISystemMessage;

export interface IMessageListProps {
  className?: string;
  customProps?: {
    [key: string]: unknown;
  };
  children?: React.ReactNode;
  isShowChild?: boolean;
  reference: any;
  dataSource: MessageType[];
  lockable: boolean;
  toBottomHeight?: String | number;
  downButton?: boolean;
  downButtonBadge?: number;
  sendMessagePreview?: boolean;
  hasNext: boolean;
  loading: boolean;
  next: () => any;
  onScroll?: React.UIEventHandler;
  onContextMenu?: MessageListEvent;
  onDeleteMsg?: MessageListEvent;
  onDownButtonClick?: React.RefObject<HTMLButtonElement>;
  onOpen?: MessageListEvent;
  onDownload?: MessageListEvent;
  onPhotoError?: MessageListEvent;
  onClick?: MessageListEvent;
  onTitleClick?: MessageListEvent;
}

export type MessageListEvent = (item: MessageType, index: number, event: React.MouseEvent<HTMLElement>) => any;

export interface ITextMessage extends IMessage {
  subType?: string;
}

export type ITextMessageProps = ITextMessage;

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

export interface IAvatarProps {
  src?: string;
  letterItem?: string;
  className?: string;
  alt?: string;
  channelType?: ChannelTypeEnum;
}

export interface IUnreadTipProps {
  unread: number;
  muted?: boolean;
  bgColorString?: string;
}

export type MessageType =
  | ({ type: 'image' } & IImageMessageProps)
  | ({ type: 'text' } & ITextMessageProps)
  | ({ type: 'system' } & ISystemMessageProps);

export type MessageListType = MessageType & IMessageListProps;

export class ChatItem extends React.Component<IChatItemProps> {}
export class ChatList extends React.Component<IChatListProps> {}
export class ImageMessage extends React.Component<IImageMessageProps> {}
export class TextMessage extends React.Component<ITextMessageProps> {}
export class SystemMessage extends React.Component<ISystemMessageProps> {}
export class MessageList extends React.Component<MessageListType> {}
export class Avatar extends React.Component<IAvatarProps> {}
export class Input extends React.Component<IInputProps> {}
export class UnreadTip extends React.Component<IUnreadTipProps> {}

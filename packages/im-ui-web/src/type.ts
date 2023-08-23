import React from 'react';

/**
 * IChatItemProps Interface
 * @prop id The Chat Item's id and required.
 * @prop avatar The Chat Item's avatar and required.
 * @prop unread The Chat Item's message unread and optional.
 * @prop className The Chat Item's component className and optional.
 * @prop alt The Chat Item's avatar alt and optional.
 * @prop title The Chat Item's title and optional.
 * @prop subtitle The Chat Item's subtitle and optional.
 * @prop date The Chat Item's message date and optional.
 * @prop dateString The Chat Item's message dateString and optional.
 * @prop statusColor The Chat Item's statusColor and optional.
 * @prop statusText The Chat Item's statusText and optional.
 * @prop muted The Chat Item's muted and optional.
 * @prop pin The Chat Item's pin and optional.
 * @prop showMute The Chat Item's showMute icon and optional.
 * @prop showVideoCall The Chat Item's showVideoCall icon and optional.
 * @prop onContextMenu The Chat Item's function onContextMenu(event: React.MouseEvent<T, MouseEvent>) and optional.
 * @prop onClick The Chat Item's function onClick(event: React.MouseEvent<T, MouseEvent>) and optional.
 * @prop onClickMute The Chat Item's mute icon function onClickMute(event: React.MouseEvent<T, MouseEvent>) and optional.
 * @prop onClickVideoCall The Chat Item's videoCall icon function onClickVideoCall(event: React.MouseEvent<T, MouseEvent>) and optional.
 * @prop onDragOver The Chat Item's drag over function and optional.
 * @prop onDragEnter The Chat Item's drag enter function and optional.
 * @prop onDrop The Chat Item's drop function and optional.
 * @prop onDragLeave The Chat Item's drop leave function and optional.
 * @prop onDragComponent The Chat Item's drag component and optional.
 * @prop letterItem The Chat Item's avatar letterItem and optional.
 */
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
  statusColor?: string;
  statusText?: string;
  muted?: boolean;
  showMute?: boolean;
  pin?: boolean;
  showVideoCall?: boolean;
  onContextMenu?: React.MouseEventHandler;
  onClick?: React.MouseEventHandler;
  onClickMute?: React.MouseEventHandler;
  onClickPin?: React.MouseEventHandler;
  onClickDelete?: React.MouseEventHandler;
  onClickVideoCall?: React.MouseEventHandler;
  onDragOver?: Function;
  onDragEnter?: Function;
  onDrop?: Function;
  onDragLeave?: Function;
  setDragStates?: Function;
  onDragComponent?: any;
  customStatusComponents?: React.ElementType<any>[];
}

/**
 * IChatListProps Interface
 * @prop id The ChatList's id and required.
 * @prop className The Chat List's component className and optional.
 * @prop datasource The Chat List's dataSource is a IChatItemProps array and required.
 * @prop cmpRef The Chat List's cmpRef and optional.
 * @prop onContextMenu The Chat Item's function onContextMenu(item: IChatItemProps, index: number, event: React.MouseEvent<HTMLElement, MouseEvent>) and optional.
 * @prop onClick The Chat Item's function onClick(item: IChatItemProps, index: number, event: React.MouseEvent<HTMLElement, MouseEvent>) and optional.
 * @prop onClickMute The Chat Item's function onClickMute(item: IChatItemProps, index: number, event: React.MouseEvent<HTMLElement, MouseEvent>) and optional.
 * @prop onClickVideoCall The Chat Item's function onClickVideoCall(item: IChatItemProps, index: number, event: React.MouseEvent<HTMLElement, MouseEvent>) and optional.
 * @prop onDragOver The Chat Item's drag over function and optional.
 * @prop onDragEnter The Chat Item's drag enter function and optional.
 * @prop onDrop The Chat Item's drop function and optional.
 * @prop onDragLeave The Chat Item's drop leave function and optional.
 * @prop onDragComponent The Chat Item's drag component and optional.
 */
export interface IChatListProps {
  id: string | number;
  className?: string;
  dataSource: IChatItemProps[];
  hasMore?: boolean;
  cmpRef?: React.Ref<HTMLButtonElement>;
  onContextMenu?: ChatListEvent;
  onClick?: ChatListEvent;
  onClickMute?: ChatListEvent;
  onClickPin?: ChatListEvent;
  onClickDelete?: ChatListEvent;
  onClickVideoCall?: ChatListEvent;
  onDragOver?: Function;
  onDragEnter?: Function;
  onDrop?: Function;
  onDragLeave?: Function;
  onDragComponent?: Function;
  loadMore: () => Promise<void>;
}

/**
 * ChatListEvent Type
 * @param item The ChatListEvent's item is a IChatItemProps.
 * @param index The Chat List's index.
 * @param event The Chat List's event.
 */
export type ChatListEvent = (item: IChatItemProps, index?: number, event?: React.MouseEvent<HTMLElement>) => any;

/**
 *
 */
export interface IDefaultProps {
  style: {
    [key: string]: unknown;
  };
  onClick: Function;
}

/**
 * IMessage Interface
 * @prop id The Message's id and requried.
 * @prop position The Message's position and requried.
 * @prop text The Message's text and requried.
 * @prop title The Message's title and requried.
 * @prop focus The Message's focus and requried.
 * @prop date The Message's date and requried.
 * @prop dateString The Message's dateString and optional.
 * @prop avatar The Message's avatar image and optional.
 * @prop titleColor The Message's titleColor and required.
 * @prop forwarded The Message's forwarded and required.
 * @prop replyButton The Message's replyButton icon and required.
 * @prop removeButton The Message's removeButton icon and required.
 * @prop status The Message's status icon and required.
 * @prop statusTitle The Message's statusTitle and required.
 * @prop notch The Message's notch and required.
 * @prop copiableDate The Message's copiableDate and optional.
 * @prop retracted The Message's retracted and required.
 * @prop className The Message's className and optional.
 * @prop letterItem The Message's letterItem is a string and optional.
 * @prop reply The Message's reply and optional.
 */
export interface IMessage {
  key: string;
  id: string | number;
  position: string;
  text: string;
  title?: string;
  focus?: boolean;
  date: number | string;
  dateString?: string;
  avatar?: string;
  titleColor?: string;
  forwarded?: boolean;
  replyButton?: boolean;
  removeButton?: boolean;
  status?: 'waiting' | 'sent' | 'received' | 'read';
  statusTitle?: string;
  notch?: boolean;
  copiableDate?: boolean;
  retracted?: boolean;
  className?: string;
  letterItem?: string;
  type: string;
  onDelete?: (id: string) => any;
}

/**
 * IImageMessage Interface
 * @prop type The Photo Message's type is "image" and required.
 * @prop width The Photo Message's width and optional.
 * @prop height The Photo Message's height and optional.
 * @prop uri The Photo Message's uri and required.
 * @prop alt The Photo Message's alt and optional.
 */
export interface IImageMessage extends IMessage {
  imgData?: {
    status?: IMessageDataStatus;
    thumbImgUrl?: string;
    imgUrl?: string;
    width?: string;
    height?: string;
    name?: string;
    extension?: string;
    size?: number;
    id?: string;
    alt?: string;
  };
}

/**
 * IImageMessageProps Interface
 * @prop type The Photo Message's type is "image" and required.
 * @prop message The Photo Message's message is a IImageMessage and required.
 * @prop onDownload The Photo Message's function onDownload(event: React.MouseEvent<T, MouseEvent>) and optional.
 * @prop onOpen The Photo Message's function onOpen(event: React.MouseEvent<T, MouseEvent>) and optional.
 * @prop onLoad The Photo Message's function onLoad(event: React.MouseEvent<T, MouseEvent>) and optional.
 * @prop onError The Photo Message's function onError(event: React.MouseEvent<T, MouseEvent>) and optional.
 */
export interface IImageMessageProps extends IImageMessage {
  onDownload?: React.MouseEventHandler;
  onOpen?: React.MouseEventHandler;
  onLoad?: React.ReactEventHandler;
  onPhotoError?: React.ReactEventHandler;
}

/**
 * IPhotoPreviewMessage Interface
 * @prop uri The Photo Preview's uri and required.
 * @prop alt The Photo Preview's alt and optional.
 */
export interface IPhotoPreview {
  uri: string;
  alt?: string;
}

/**
 * IPhotoPreviewMessageProps Interface
 * @prop onClose The Photo Preview's function onClose(event: React.MouseEvent<T, MouseEvent>) and required.
 */
export interface IPhotoPreviewProps extends IPhotoPreview {
  onClose: () => void;
}

/**
 * ISystemMessage Interface extends IMessage
 * @prop type The System Message's type is "system" and required.
 * @prop text The System Message's text and requried.
 */
export interface ISystemMessage extends IMessage {
  text: string;
}

/**
 * ISystemMessageProps Interface
 * @prop type The System Message's type is "system" and required.
 * @prop message The System Message's message is ISystemMessage and required.
 * @prop className The System Message's className and optional.
 */
export interface ISystemMessageProps extends ISystemMessage {
  className?: string;
}

/**
 * IMessageBoxProps Interface
 * @prop data The Message Box'es data is a MessageType and required.
 * @prop onMessageFocused The Message Box'es onMessageFocused and optional.
 * @prop renderAddCmp The Message Box'es renderAddCmp is a component and optional.
 * @prop onClick The Message Box'es function onClick(event: React.MouseEvent<T, MouseEvent>) and optional.
 * @prop onOpen The Message Box'es function onOpen(event: React.MouseEvent<T, MouseEvent>) and optional.
 * @prop onPhotoError The Message Box'es function onPhotoError(event: React.MouseEvent<T, MouseEvent>) and optional.
 * @prop onContextMenu The Message Box'es function onContextMenu(event: React.MouseEvent<T, MouseEvent>) and optional.
 * @prop onForwardClick The Message Box'es function onForwardClick(event: React.MouseEvent<T, MouseEvent>) and optional.
 * @prop onReplyClick The Message Box'es function onReplyClick(event: React.MouseEvent<T, MouseEvent>) and optional.
 * @prop onRemoveMessageClick The Message Box'es function onRemoveMessageClick(event: React.MouseEvent<T, MouseEvent>) and optional.
 * @prop onTitleClick The Message Box'es function onTitleClick(event: React.MouseEvent<T, MouseEvent>) and optional.
 * @prop onMeetingMessageClick The Message Box'es function onMeetingMessageClick(event: React.MouseEvent<T, MouseEvent>) and optional.
 * @prop onDownload The Message Box'es function onDownload(event: React.MouseEvent<T, MouseEvent>) and optional.
 * @prop onMeetingMoreSelect The Message Box'es function onMeetingMoreSelect(event: React.MouseEvent<T, MouseEvent>) and optional.
 * @prop onMeetingLinkClick The Message Box'es function onMeetingLinkClick(event: React.MouseEvent<T, MouseEvent>) and optional.
 * @prop onMeetingTitleClick The Message Box'es function onMeetingTitleClick(event: React.MouseEvent<T, MouseEvent>) and optional.
 * @prop onMeetingVideoLinkClick The Message Box'es function onMeetingVideoLinkClick(event: React.MouseEvent<T, MouseEvent>) and optional.
 */
export interface IMessageBoxProps {
  onMessageFocused?: any;
  renderAddCmp?: JSX.Element | (() => JSX.Element);
  onClick?: React.MouseEventHandler;
  onOpen?: React.MouseEventHandler;
  onDelete?: (id: string) => Promise<any>;
  onPhotoError?: React.MouseEventHandler;
  onContextMenu?: React.MouseEventHandler;
  onForwardClick?: React.MouseEventHandler;
  onReplyClick?: React.MouseEventHandler;
  onRemoveMessageClick?: React.MouseEventHandler;
  onTitleClick?: React.MouseEventHandler;
  onReplyMessageClick?: React.MouseEventHandler;
  onMeetingMessageClick?: React.MouseEventHandler;
  onDownload?: React.MouseEventHandler;
  onMeetingMoreSelect?: React.MouseEventHandler;
  onMeetingLinkClick?: React.MouseEventHandler;
  onMeetingTitleClick?: React.MouseEventHandler;
  onMeetingVideoLinkClick?: React.MouseEventHandler;
  styles?: React.CSSProperties;
  notchStyle?: React.CSSProperties;
}

/**
 * IMessageListProps Interface
 * @prop className The Message List's className and optional.
 * @prop customProps The Message List's customProps and optional.
 * @prop children The Message List's children and optional.
 * @prop referance The Message List's referance is a ref and required.
 * @prop datasource The Message List's datasource is IMessageBoxProps and required.
 * @prop lockable The Message List's lockable and required.
 * @prop toBottomHeight The Message List's to bottom height and optional.
 * @prop down button The Message List's down button and required.
 * @prop downButtonBadge The Message List's down button badge and required.
 * @prop sendMessagePreview The Message List's send message preview and required.
 * @prop onScroll The Message List's function onScroll(event: React.UIEvent<T, UIEvent>) and optional.
 * @prop onContextMenu The Message List's function onContextMenu(item: IMessageBoxProps, index: number, event: React.MouseEvent<HTMLElement, MouseEvent>) and optional.
 * @prop onDownButtonClick The Message List's onDownButtonClick is a ref and optional.
 * @prop onOpen The Message List's function onOpen(item: IMessageBoxProps, index: number, event: React.MouseEvent<HTMLElement, MouseEvent>) and optional.
 * @prop onDownload The Message List's function onDownload(item: IMessageBoxProps, index: number, event: React.MouseEvent<HTMLElement, MouseEvent>) and optional.
 * @prop onPhotoError The Message List's function onPhotoError(item: IMessageBoxProps, index: number, event: React.MouseEvent<HTMLElement, MouseEvent>) and optional.
 * @prop onMeetingMoreSelect The Message List's function onMeetingMoreSelect(item: IMessageBoxProps, index: number, event: React.MouseEvent<HTMLElement, MouseEvent>) and optional.
 * @prop onMessageFocused The Message List's function onMessageFocused(item: IMessageBoxProps, index: number, event: React.MouseEvent<HTMLElement, MouseEvent>) and optional.
 * @prop onClick The Message List's function onClick(item: IMessageBoxProps, index: number, event: React.MouseEvent<HTMLElement, MouseEvent>) and optional.
 * @prop onForwardClick The Message List's function onForwardClick(item: IMessageBoxProps, index: number, event: React.MouseEvent<HTMLElement, MouseEvent>) and optional.
 * @prop onReplyClick The Message List's function onReplyClick(item: IMessageBoxProps, index: number, event: React.MouseEvent<HTMLElement, MouseEvent>) and optional.
 * @prop onReplyMessageClick The Message List's function onReplyMessageClick(item: IMessageBoxProps, index: number, event: React.MouseEvent<HTMLElement, MouseEvent>) and optional.
 * @prop onTitleClick The Message List's function onTitleClick(item: IMessageBoxProps, index: number, event: React.MouseEvent<HTMLElement, MouseEvent>) and optional.
 * @prop onRemoveMessageClick The Message List's function onRemoveMessageClick(item: IMessageBoxProps, index: number, event: React.MouseEvent<HTMLElement, MouseEvent>) and optional.
 * @prop onMeetingMessageClick The Message List's function onMeetingMessageClick(item: IMessageBoxProps, index: number, event: React.MouseEvent<HTMLElement, MouseEvent>) and optional.
 * @prop onMeetingTitleClick The MessageList's function onMeetingTitleClick(event: React.MouseEvent<T, MouseEvent>) and optional.
 * @prop onMeetingVideoLinkClick The MessageList's function onMeetingVideoLinkClick(event: React.MouseEvent<T, MouseEvent>) and optional.
 * @prop onMeetingLinkClick The Message List's function onMeetingLinkClick(item: IMessageBoxProps, index: number, event: React.MouseEvent<HTMLElement, MouseEvent>) and optional.
 */
export interface IMessageListProps {
  className?: string;
  customProps?: {
    [key: string]: unknown;
  };
  children?: React.ReactNode;
  isShowChild?: boolean;
  referance: any;
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
  onDelete?: (id: string) => Promise<any>;
  onDownButtonClick?: React.RefObject<HTMLButtonElement>;
  onOpen?: MessageListEvent;
  onDownload?: MessageListEvent;
  onPhotoError?: MessageListEvent;
  onMeetingMoreSelect?: MessageListEvent;
  onMessageFocused?: MessageListEvent;
  onClick?: MessageListEvent;
  onForwardClick?: MessageListEvent;
  onReplyClick?: MessageListEvent;
  onReplyMessageClick?: MessageListEvent;
  onTitleClick?: MessageListEvent;
  onRemoveMessageClick?: MessageListEvent;
  onMeetingMessageClick?: MessageListEvent;
  onMeetingTitleClick?: React.MouseEventHandler;
  onMeetingVideoLinkClick?: React.MouseEventHandler;
  onMeetingLinkClick?: MessageListEvent;
  messageBoxStyles?: React.CSSProperties;
  notchStyle?: React.CSSProperties;
}

/**
 * MessageListEvent Type
 * @param item The MessageListEvent's item is a IMessageBoxProps.
 * @param index The MessageListEvent's index.
 * @param event The MessageListEvent's event.
 */
export type MessageListEvent = (item: MessageType, index: number, event: React.MouseEvent<HTMLElement>) => any;

/**
 * ITextMessage Interface extends IMessage
 * @prop type The Text Message's type is "text" and required.
 */
export interface ITextMessage extends IMessage {
  subType?: string;
}

/**
 * ITextMessageProps Interface
 * @prop type The Text Message's type is "text" and required.
 * @prop message The Text Message's message is a ITextMessage and required.
 * @prop dateString The Text Message's dateString and optional.
 */
export interface ITextMessageProps extends ITextMessage {
  // dateString?: string;
  // copyClipboard: function;
}

/**
 * IInputProps Interface
 * @prop autofocus The Input's autofocus and optional.
 * @prop referance The Input's referance is a ref and optional.
 * @prop clear The Input's clear and optional.
 * @prop maxlength The Input's maxlength and optional.
 * @prop maxHeight The Input's maxheight and optional.
 * @prop onMaxLengthExceed The Input's onMaxLengthExceed function and optional.
 * @prop onChange The Input's onChange function and optional.
 * @prop multiline The Input's multiline and optional.
 * @prop autoHeight The Input's autoHeight and optional.
 * @prop minHeight The Input's minheight and optional.
 * @prop className The Input's classname and optional.
 * @prop leftButtons The Input's leftbuttons is a component and optional.
 * @prop rightButtons The Input's rightbuttons is a component and optional.
 * @prop type The Input's type and optional.
 * @prop placeholder The Input's placeholder and optional.
 * @prop defaultValue The Input's default value and optional.
 * @prop inputStyle The Input's input style and optional.
 * @prop onCopy The Input's function onCopy(event: React.ClipboardEvent<T>) and optional.
 * @prop onCut The Input's function onCut(event: React.ClipboardEvent<T>) and optional.
 * @prop onPaste The Input's function onPaste(event: React.ClipboardEvent<T>) and optional.
 * @prop onBlur The Input's function onBlur(event: React.FocusEvent<T, Element>) and optional.
 * @prop onFocus The Input's function onFocus(event: React.FocusEvent<T, Element>) and optional.
 * @prop onSelect The Input's function onSelect(event: React.SyntheticEvent<T, Event>) and optional.
 * @prop onSubmit The Input's function onSubmit(event: React.FormEvent<T>) and optional.
 * @prop onReset The Input's function onReset(event: React.FormEvent<T>) and optional.
 * @prop onKeyDown The Input's function onKeyDown(event: React.KeyboardEvent<T>) and optional.
 * @prop onKeyPress The Input's function onKeyPress(event: React.KeyboardEvent<T>) and optional.
 * @prop onKeyUp The Input's function onKeyUp(event: React.KeyboardEvent<T>) and optional.
 */
export interface IInputProps {
  autofocus?: boolean;
  referance?: any; // sor ve 46.satır
  clear?: Function;
  maxlength?: number;
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

/**
 * IMessageDataStatus Interface
 * @prop error The File Message Data Status's error and optional.
 * @prop download The File Message Data Status's download function and optional.
 * @prop click The File Message Data Status's click function and optional.
 * @prop loading The File Message Data Status's loading and optional.
 */
export interface IMessageDataStatus {
  autoDownload?: boolean;
  error?: boolean;
  download?: Function | boolean;
  click?: Function | boolean;
  loading?: boolean | number;
}

/**
 * IDropdownProps Interface
 * @prop className The Dropdown's className and optional.
 * @prop buttonProps The Dropdown's button props and optional.
 * @prop animationType The Dropdown's animation type and optional.
 * @prop animationPosition The Dropdown's animation position and optional.
 * @prop title The Dropdown's title and optional.
 * @prop items The Dropdown's items is a IDropdownItemType array and required.
 * @prop onSelect The Dropdown's onSelect function and optional.
 * @prop style The Dropdown's style is an object containing color, borderColor and optional.
 */
export interface IDropdownProps {
  className?: string;
  buttonProps?: Object;
  animationType?: string;
  animationPosition?: string;
  title?: string;
  items: IDropdownItemType[];
  onSelect: Function;
  style?: {
    color?: string;
    borderColor?: string;
  };
}

/**
 * IButtonProps Interface
 * @prop title The Button's title and optional.
 * @prop text The Button's text and optional.
 * @prop buttonRef The Button's ref and optional.
 * @prop type The Button's type and optional.
 * @prop className The Button's className and optional.
 * @prop backgroundColor The Button's background color and optional.
 * @prop color The Button's color and optional.
 * @prop disabled The Button's disabled and optional.
 * @prop onClick The Button's onClick function and optional.
 * @prop icon The Button's icon is a IButtonIcon and optional.
 */
export interface IButtonProps {
  title?: string;
  text?: string;
  buttonRef?: React.RefObject<HTMLButtonElement>;
  type?: string;
  className?: string;
  backgroundColor?: string;
  color?: string;
  disabled?: boolean;
  onClick?: React.MouseEventHandler;
  icon?: IButtonIcon;
}

/**
 * IButtonIcon Interface
 * @prop float The Button Icon's float and optional.
 * @prop size The Button Icon's size and optional.
 * @prop components The Button Icon's components and optional.
 */
export interface IButtonIcon {
  float?: any;
  size?: number;
  component?: React.ReactChild;
}

/**
 * IDropDownItemType Type
 * @type IDropdown
 * @type string
 */
type IDropdownItemType = IDropdownItem | string;

/**
 * IDropdownItem Interface
 * @prop icon The Dropdown Item's icon and optional.
 * @prop text The Dropdown Item's text and optional.
 */
export interface IDropdownItem {
  icon?: IDropdownItemIcon;
  text?: string;
}

/**
 * IDropdownItemIcon Interface
 * @prop float The Dropdown Item Icon's float and optional.
 * @prop color The Dropdown Item Icon's color and optional.
 * @prop size The Dropdown Item Icon's size and optional.
 * @prop className The Dropdown Item Icon's className and optional.
 * @prop component The Dropdown Item Icon's component and optional.
 */
export interface IDropdownItemIcon {
  float?: any;
  color?: string;
  size?: number;
  className?: string;
  component?: React.ReactChild;
}

/**
 * ISideBarProps Interface
 * @type type The Side Bar's type and optional.
 * @type data The Side Bar's data is ISideBar and optional.
 */
export interface ISideBarProps extends ISideBar {
  type?: string;
  data: ISideBar;
}

/**
 * ISideBar Interface
 * @prop top The Side Bar's top is a component and optional.
 * @prop center The Side Bar's center is a component and optional.
 * @prop bottom The Side Bar's bottom is a component and optional.
 * @prop className The Side Bar's className and optional.
 */
export interface ISideBar {
  top?: any;
  center?: any;
  bottom?: any;
  className?: string;
}

/**
 * IPopup Interface
 * @prop show The Popup's show and optional.
 * @prop header The Popup's header and optional.
 * @prop text The Popup's text and optional.
 * @prop footerButtons The Popup's footer buttons array and optional.
 * @prop headerButtons The Popup's header buttons array and optional.
 * @prop renderHeader The Popup's renderHeader function and optional.
 * @prop renderContent The Popup's renderContent function and optional.
 * @prop renderFooter The Popup's renderFooter function and optional.
 * @prop color The Popup's color and optional.
 */
export interface IPopup {
  show?: boolean;
  header?: string;
  text?: string;
  footerButtons?: Array<{
    color?: string;
    backgroundColor?: string;
    text?: string;
    onClick?: React.MouseEventHandler;
  }>;
  headerButtons?: Array<{
    type?: string;
    color?: string;
    icon?: {
      component?: React.ReactChild;
      size?: number;
    };
    onClick?: React.MouseEventHandler;
  }>;
  renderHeader?: Function;
  renderContent?: Function;
  renderFooter?: Function;
  color?: string;
}

/**
 * IPopupProps Interface
 * @prop popup The Popup's popup is a IPopup and required.
 * @prop type The Popup's type and optional.
 * @prop className The Popup's className and optional.
 */
export interface IPopupProps {
  popup: IPopup;
  type?: string;
  className?: string;
}

/**
 * IAvatarProps Interface
 * @prop src The Avatar's src is an image source and required.
 * @prop letterItem The Avatar's letterItem is a string and optional.
 * @prop className The Avatar's className and optional.
 * @prop alt The Avatar's alt and optional.
 */
export interface IAvatarProps {
  src?: string;
  letterItem?: string;
  className?: string;
  alt?: string;
}

/**
 * INavbarProps Interface
 * @prop type The Navbar's type and optional.
 * @prop className The Navbar's className and optional.
 * @prop top The Side Bar's top is a component and optional.
 * @prop center The Side Bar's center is a component and optional.
 * @prop bottom The Side Bar's bottom is a component and optional.
 */
export interface INavbarProps {
  type?: string;
  className?: string;
  left?: any;
  center?: any;
  right?: any;
}

/**
 * IUnreadTipProps Interface
 * @prop unread The UnreadTip's unread number and required.
 * @prop muted The UnreadTip's muted and optional.
 * @prop bgColorString The UnreadTip's bgColorString and optional.
 */
export interface IUnreadTipProps {
  unread: number;
  muted?: boolean;
  bgColorString?: string;
}

/**
 * MessageType Type
 * @type IImageMessageProps
 * @type ITextMessageProps
 * @type ISystemMessageProps
 */
export type MessageType =
  | ({ type: 'image' } & IImageMessageProps)
  | ({ type: 'text' } & ITextMessageProps)
  | ({ type: 'system' } & ISystemMessageProps);

export type MessageBoxType = MessageType & IMessageBoxProps;

export class ChannelItem extends React.Component<IChatItemProps> {}
export class ChannelList extends React.Component<IChatListProps> {}
export class MessageBox extends React.Component<MessageBoxType> {}
export class PhotoMessage extends React.Component<IImageMessageProps> {}
export class TextMessage extends React.Component<ITextMessageProps> {}
export class SystemMessage extends React.Component<ISystemMessageProps> {}
export class MessageList extends React.Component<IMessageListProps> {}
export class Avatar extends React.Component<IAvatarProps> {}
export class Input extends React.Component<IInputProps> {}
export class UnreadTip extends React.Component<IUnreadTipProps> {}
export class PhotoPreview extends React.Component<IPhotoPreviewProps> {}

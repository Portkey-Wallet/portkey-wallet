import { ChannelMemberInfo, ChannelTypeEnum, MessageType } from '@portkey-wallet/im/types';
import { isAelfAddress } from '@portkey-wallet/utils/aelf';
import { IconName } from 'components/Svg';
import { TextInputScrollEventData, TextInputSelectionChangeEventData } from 'react-native';

export class ChatInputRecorder {
  public text?: string;
  public selection?: TextInputSelectionChangeEventData['selection'];
  public contentOffset?: TextInputScrollEventData['contentOffset'];
  public setText(text: string) {
    this.text = text;
  }
  public setSelection(selection: TextInputSelectionChangeEventData['selection']) {
    this.selection = selection;
  }
  public setContentOffset(contentOffset?: TextInputScrollEventData['contentOffset']) {
    this.contentOffset = contentOffset;
  }
  reset() {
    this.text = '';
    this.selection = undefined;
    this.contentOffset = undefined;
  }
}
export let chatInputRecorder: ChatInputRecorder | undefined;

export function initChatInputRecorder() {
  if (chatInputRecorder) return;
  chatInputRecorder = new ChatInputRecorder();
}

export function destroyChatInputRecorder() {
  if (!chatInputRecorder) return;
  chatInputRecorder = undefined;
}

export function handleInputText(code: string): string {
  let text = chatInputRecorder?.text || '';
  if (chatInputRecorder?.selection) {
    const { start, end } = chatInputRecorder?.selection;
    if (start === end) {
      const first = text.slice(0, start) + code;
      const last = text.slice(start);
      chatInputRecorder.setSelection({ start: first.length, end: first.length });
      text = first + last;
    } else {
      const first = text.slice(0, start);
      const last = text.slice(end);
      text = first + last;
      chatInputRecorder.setText(text);
      chatInputRecorder.setSelection({ start: first.length, end: first.length });
      return handleInputText(code);
    }
  } else {
    text = text + code;
    chatInputRecorder?.setSelection({ start: text.length, end: text.length });
  }
  if (chatInputRecorder) {
    chatInputRecorder.setText(text);
  }
  return text;
}
export function isEmoji(character: string) {
  return /\p{Emoji}/u.test(character);
}

export function isEmojiString(text: string) {
  return /[\u{1F300}-\u{1F64F}\u{1F680}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F900}-\u{1F9FF}\u{1F1E0}-\u{1F1FF}]/u.test(
    text,
  );
}

export function handleDeleteText(): string {
  let text = chatInputRecorder?.text || '';
  if (chatInputRecorder?.selection) {
    const { start, end } = chatInputRecorder?.selection;
    if (start === end) {
      let first = text.slice(0, start);
      const last = text.slice(start);
      const code = isEmoji(first.slice(-2)) ? -2 : -1;
      first = first.slice(0, code);
      chatInputRecorder.setSelection({ start: first.length, end: first.length });
      text = first + last;
    } else {
      const first = text.slice(0, start);
      const last = text.slice(end);
      text = first + last;
      chatInputRecorder.setText(text);
      chatInputRecorder.setSelection({ start: first.length, end: first.length });
      return text;
    }
  } else {
    const code = isEmoji(text.slice(-2)) ? -2 : -1;
    text = text.slice(0, code);
    chatInputRecorder?.setSelection({ start: text.length, end: text.length });
  }
  if (chatInputRecorder) {
    chatInputRecorder.setText(text);
  }
  return text;
}

export function getChatListSvgName(channelType?: ChannelTypeEnum): IconName | undefined {
  if (channelType === ChannelTypeEnum.GROUP) return 'chat-group-avatar';
  if (channelType === ChannelTypeEnum.P2P) return undefined;
  return 'chat-unsupported-channel';
}

export function isCommonView(type?: MessageType | 'NOT_SUPPORTED'): boolean {
  return type === 'REDPACKAGE-CARD' || type === 'TRANSFER-CARD';
}

export function isSystemTypeMessage(type?: MessageType | 'NOT_SUPPORTED'): boolean {
  return type === 'PIN-SYS' || type === 'SYS';
}

export const isTargetMember = (item: ChannelMemberInfo, keyword: string): boolean => {
  // name
  if (item?.name?.toLocaleLowerCase()?.trim()?.includes(keyword?.toLocaleLowerCase()?.trim())) return true;

  // portkeyId
  if (item?.userId?.trim() === keyword?.trim()) return true;

  // addresses
  const addressesList = item?.addresses || [];
  if (
    addressesList.some(i => {
      if (keyword?.includes('_')) {
        const arr = keyword?.split('_');
        const _address = arr.find(_i => isAelfAddress(_i));
        if (_address) keyword = _address;
      }
      return i?.address === keyword;
    }, [])
  )
    return true;

  return false;
};

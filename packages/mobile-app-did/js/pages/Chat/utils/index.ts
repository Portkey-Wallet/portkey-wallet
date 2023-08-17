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
}
let chatInputRecorder: ChatInputRecorder | undefined;

function initChatInputRecorder() {
  if (chatInputRecorder) return;
  chatInputRecorder = new ChatInputRecorder();
}

function destroyChatInputRecorder() {
  if (!chatInputRecorder) return;
  chatInputRecorder = undefined;
}

function handleInputText(code: string): string {
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
function isEmoji(character: string) {
  return /\p{Emoji}/u.test(character);
}
function handleDeleteText(): string {
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

export { chatInputRecorder, initChatInputRecorder, destroyChatInputRecorder, handleInputText, handleDeleteText };

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
    text = chatInputRecorder?.text + code;
    chatInputRecorder?.setSelection({ start: text.length, end: text.length });
  }
  if (chatInputRecorder) {
    chatInputRecorder.setText(text);
  }
  return text;
}

export { chatInputRecorder, initChatInputRecorder, destroyChatInputRecorder, handleInputText };

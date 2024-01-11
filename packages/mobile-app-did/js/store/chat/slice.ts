import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { ChatMessage } from 'pages/Chat/types';
import { TextInputSelectionChangeEventData } from 'react-native';

export enum ChatBottomBarStatus {
  input,
  tools,
  emoji,
}

export type ReplyMessageInfoType = {
  messageType: 'text' | 'img';
  message?: ChatMessage;
};
export interface ChatsState {
  currentChannel?: {
    currentChannelId: string;
    currentChannelType: 'P2P' | 'Group';
  };
  showTools?: boolean;
  bottomBarStatus?: ChatBottomBarStatus;
  text: string;
  replyMessageInfo?: ReplyMessageInfoType;
  selection?: TextInputSelectionChangeEventData['selection'];
  showSoftInputOnFocus?: boolean;
}
const initialState: ChatsState = { text: '' };

export const chatSlice = createSlice({
  name: 'chats',
  initialState,
  reducers: {
    setChatText: (state, action: PayloadAction<ChatsState['text']>) => {
      state.text = action.payload;
    },
    setCurrentChannel: (state, action: PayloadAction<ChatsState['currentChannel']>) => {
      state.currentChannel = action.payload;
    },
    setReplyMessageInfo: (state, action: PayloadAction<ChatsState['replyMessageInfo']>) => {
      state.replyMessageInfo = action.payload;
    },
    setChatSelection: (state, action: PayloadAction<ChatsState['selection']>) => {
      state.selection = action.payload;
    },
    setBottomBarStatus: (state, action: PayloadAction<ChatsState['bottomBarStatus']>) => {
      state.bottomBarStatus = action.payload;
    },
    setShowSoftInputOnFocus: (state, action: PayloadAction<ChatsState['showSoftInputOnFocus']>) => {
      state.showSoftInputOnFocus = action.payload;
    },
  },
});

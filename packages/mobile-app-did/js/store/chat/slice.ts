import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { TextInputSelectionChangeEventData } from 'react-native';

export enum ChatBottomBarStatus {
  input,
  tools,
  emoji,
}

export interface ChatsState {
  currentChannelId?: string;
  showTools?: boolean;
  bottomBarStatus?: ChatBottomBarStatus;
  text: string;
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
    setCurrentChannelId: (state, action: PayloadAction<ChatsState['currentChannelId']>) => {
      state.currentChannelId = action.payload;
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

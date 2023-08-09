import { PayloadAction, createSlice } from '@reduxjs/toolkit';

export enum ChatBottomBarStatus {
  input,
  tools,
  emoji,
}

export interface ChatsState {
  showTools?: boolean;
  bottomBarStatus?: ChatBottomBarStatus;
  text: string;
}
const initialState: ChatsState = { text: '' };

export const chatSlice = createSlice({
  name: 'chats',
  initialState,
  reducers: {
    setChatText: (state, action: PayloadAction<ChatsState['text']>) => {
      state.text = action.payload;
    },
    setBottomBarStatus: (state, action: PayloadAction<ChatsState['bottomBarStatus']>) => {
      state.bottomBarStatus = action.payload;
    },
  },
});

import { chatSlice } from 'store/chat/slice';

export const { setChatText, setReplyMessageInfo, setBottomBarStatus, setShowSoftInputOnFocus, setCurrentChannelId } =
  chatSlice.actions;

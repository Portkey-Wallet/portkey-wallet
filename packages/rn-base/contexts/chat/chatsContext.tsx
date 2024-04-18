import { chatSlice } from '../../store-app/chat/slice';

export const { setChatText, setReplyMessageInfo, setBottomBarStatus, setShowSoftInputOnFocus, setCurrentChannel } =
  chatSlice.actions;

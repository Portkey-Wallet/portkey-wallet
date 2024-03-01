import { useLatestRef } from '@portkey-wallet/hooks';
import { ChatBottomBarStatus } from 'store/chat/slice';
import { useAppDispatch, useAppSelector } from 'store/hooks';

export function useBottomBarStatus() {
  return useAppSelector(state => state.chats.bottomBarStatus);
}

export function useChatText() {
  return useAppSelector(state => state.chats.text);
}

export function useChatReplyMessageInfo() {
  return useAppSelector(state => state.chats.replyMessageInfo);
}

export function useIsShowInput() {
  return useAppSelector(state => state.chats.bottomBarStatus) === ChatBottomBarStatus.input;
}
export function useIsShowEmoji() {
  return useAppSelector(state => state.chats.bottomBarStatus) === ChatBottomBarStatus.emoji;
}
export function useShowSoftInputOnFocus() {
  return useAppSelector(state => state.chats.showSoftInputOnFocus);
}

export function useChatsDispatch() {
  return useAppDispatch();
}

export function useLatestText() {
  const text = useChatText();
  return useLatestRef(text);
}

export function useCurrentChannel() {
  return useAppSelector(state => state.chats.currentChannel);
}

export function useCurrentChannelId() {
  return useAppSelector(state => state.chats.currentChannel?.currentChannelId);
}

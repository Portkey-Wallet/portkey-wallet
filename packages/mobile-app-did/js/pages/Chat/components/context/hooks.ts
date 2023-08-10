import { useLatestRef } from '@portkey-wallet/hooks';
import { useAppDispatch, useAppSelector } from 'store/hooks';

export function useBottomBarStatus() {
  return useAppSelector(state => state.chats.bottomBarStatus);
}

export function useChatText() {
  return useAppSelector(state => state.chats.text);
}
export function useChatsDispatch() {
  return useAppDispatch();
}

export function useLatestText() {
  const text = useChatText();
  return useLatestRef(text);
}

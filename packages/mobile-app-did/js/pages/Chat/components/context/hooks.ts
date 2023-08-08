import { useMemo } from 'react';
import { useChats } from './chatsContext';
import { useLatestRef } from '@portkey-wallet/hooks';

export function useBottomBarStatus() {
  const [{ bottomBarStatus }] = useChats();
  return useMemo(() => bottomBarStatus, [bottomBarStatus]);
}

export function useChatText() {
  const [{ text }] = useChats();
  return useMemo(() => text, [text]);
}
export function useChatsDispatch() {
  const [, dispatch] = useChats();
  return useMemo(() => dispatch, [dispatch]);
}

export function useLatestText() {
  const text = useChatText();
  return useLatestRef(text);
}

import { useFocusEffect } from '@react-navigation/native';
import { MutableRefObject, useCallback, useEffect, useRef } from 'react';
import { useAppCASelector } from '@portkey-wallet/hooks/hooks-ca';
import { TextInput } from 'react-native';

export const useInputFocus = (iptRef: MutableRefObject<TextInput | undefined | null>, isActive = true, delay = 600) => {
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  // if drawer open , not focus
  const { isDrawerOpen } = useAppCASelector(state => state.discover);

  useFocusEffect(
    useCallback(() => {
      if (!isActive) return;
      if (!iptRef.current) return;
      if (isDrawerOpen) return;

      timerRef.current = setTimeout(() => {
        iptRef.current?.focus();
      }, delay);
    }, [delay, iptRef, isActive, isDrawerOpen]),
  );

  useEffect(
    () => () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    },
    [],
  );
};

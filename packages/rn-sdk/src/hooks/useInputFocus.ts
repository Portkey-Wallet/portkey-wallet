import { MutableRefObject, useCallback, useEffect, useRef } from 'react';
import { TextInput } from 'react-native';

export const useInputFocus = (iptRef: MutableRefObject<TextInput | undefined | null>, isActive = true, delay = 200) => {
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const startTimeout = useCallback(() => {
    if (!isActive) return;
    if (!iptRef.current) return;

    timerRef.current = setTimeout(() => {
      iptRef.current?.focus();
    }, delay);
  }, [delay, iptRef, isActive]);

  startTimeout();

  useEffect(
    () => () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    },
    [],
  );
};

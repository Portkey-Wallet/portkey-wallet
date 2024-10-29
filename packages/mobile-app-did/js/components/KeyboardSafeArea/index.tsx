import { screenHeight } from '@portkey-wallet/utils/mobile/device';
import { useKeyboard } from 'hooks/useKeyboardHeight';
import { TopSpacing } from 'pages/Chat/components/hooks';
import React, { ReactNode, useEffect, useMemo, useRef } from 'react';
import { View } from 'react-native';

export type TKeyboardSafeAreaProps = {
  children: ReactNode;
};
export const KeyboardSafeArea = ({ children }: TKeyboardSafeAreaProps) => {
  const viewRef = useRef<View>(null);
  const { keyboardHeight, isKeyboardOpened } = useKeyboard(0);

  const viewPositionYRef = useRef(0);
  useEffect(() => {
    requestAnimationFrame(() => {
      if (viewRef.current) {
        viewRef.current.measure((x, y, width, height, pageX, pageY) => {
          viewPositionYRef.current = pageY + height;
        });
      }
    });
  }, []);

  const style = useMemo(() => {
    if (!isKeyboardOpened) return undefined;
    const keyboardPositionY = screenHeight - keyboardHeight;
    const viewPositionY = viewPositionYRef.current;
    if (viewPositionY <= keyboardPositionY) return undefined;

    return {
      paddingBottom: viewPositionY - keyboardPositionY,
    };
  }, [isKeyboardOpened, keyboardHeight]);

  return (
    <View ref={viewRef} style={style}>
      {children}
    </View>
  );
};

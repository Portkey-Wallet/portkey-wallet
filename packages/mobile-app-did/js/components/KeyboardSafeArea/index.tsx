import { screenHeight } from '@portkey-wallet/utils/mobile/device';
import { useKeyboard } from 'hooks/useKeyboardHeight';
import { TopSpacing } from 'pages/Chat/components/hooks';
import React, { ReactNode, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';

export type TKeyboardSafeAreaProps = {
  children?: ReactNode;
  bottomPad?: number;
  style?: StyleProp<ViewStyle>;
};
export const KeyboardSafeArea = ({ children, bottomPad = 0, style: styleProp }: TKeyboardSafeAreaProps) => {
  const viewRef = useRef<View>(null);
  const { keyboardHeight, isKeyboardOpened } = useKeyboard(0);
  const [viewPositionY, setViewPositionY] = useState(0);

  const measureView = useCallback(() => {
    requestAnimationFrame(() => {
      if (viewRef.current) {
        viewRef.current.measure?.((x, y, width, height, pageX, pageY) => {
          if (pageY === undefined || height === undefined) return;
          setViewPositionY(pageY + height);
        });
      }
    });
  }, []);

  useEffect(() => {
    setTimeout(() => {
      measureView();
    }, 100);
  }, [measureView]);

  useEffect(() => {
    if (!isKeyboardOpened) return;
    measureView();
  }, [isKeyboardOpened, measureView]);

  const style = useMemo(() => {
    if (!isKeyboardOpened) return undefined;
    const keyboardPositionY = screenHeight - keyboardHeight;
    if (viewPositionY <= keyboardPositionY) return undefined;

    const value = viewPositionY - keyboardPositionY + bottomPad;
    return {
      paddingBottom: value,
    };
  }, [bottomPad, isKeyboardOpened, keyboardHeight, viewPositionY]);

  return (
    <View ref={viewRef} collapsable={false} style={[styleProp, style]}>
      {children}
    </View>
  );
};

export const useKeyboardSafeArea = (bottomPad = 0) => {
  const viewRef = useRef<View>(null);

  const { keyboardHeight, isKeyboardOpened } = useKeyboard(0);
  const [viewPositionY, setViewPositionY] = useState(0);

  const measureView = useCallback(() => {
    requestAnimationFrame(() => {
      if (viewRef.current) {
        viewRef.current.measure?.((x, y, width, height, pageX, pageY) => {
          if (pageY === undefined || height === undefined) return;
          setViewPositionY(pageY + height);
        });
      }
    });
  }, []);

  useEffect(() => {
    setTimeout(() => {
      measureView();
    }, 100);
  }, [measureView]);

  const value = useMemo(() => {
    if (!isKeyboardOpened) return undefined;
    const keyboardPositionY = screenHeight - keyboardHeight;
    if (viewPositionY <= keyboardPositionY) return undefined;

    return viewPositionY - keyboardPositionY + bottomPad;
  }, [bottomPad, isKeyboardOpened, keyboardHeight, viewPositionY]);

  return {
    ref: viewRef,
    value,
  };
};

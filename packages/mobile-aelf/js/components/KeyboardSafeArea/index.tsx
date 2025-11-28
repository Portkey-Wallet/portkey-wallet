import { screenHeight } from '@portkey-wallet/utils-mobile/device';
import { useKeyboard } from 'hooks/useKeyboardHeight';
import React, { ReactNode, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { StatusBar, useWindowDimensions, View } from 'react-native';
import { ViewStyleType } from 'types/styles';

export type TKeyboardSafeAreaProps = {
  children?: ReactNode;
  bottomPad?: number;
  gap?: number;
  containerStyle?: ViewStyleType;
  mode?: 'default' | 'page';
  disable?: boolean;
};
export const KeyboardSafeArea = ({
  children,
  bottomPad = 0,
  containerStyle,
  mode = 'default',
  gap,
  disable = false,
}: TKeyboardSafeAreaProps) => {
  const viewRef = useRef<View>(null);
  const { keyboardHeight, isKeyboardOpened } = useKeyboard(0);
  const [viewPositionY, setViewPositionY] = useState(0);
  const sz = useWindowDimensions();
  const measureView = useCallback(() => {
    requestAnimationFrame(() => {
      if (viewRef.current) {
        viewRef.current.measure?.((x, y, width, height, pageX, pageY) => {
          if (pageY === undefined || height === undefined) {
            return;
          }
          setViewPositionY(pageY + height);
        });
      }
    });
  }, []);

  useEffect(() => {
    if (mode === 'page') {
      setTimeout(() => {
        if (viewRef.current) {
          viewRef.current.measure?.((x, y, width, height, pageX, pageY) => {
            console.log('pageY', pageY, 'height', height, 'screenHeight', screenHeight);
            if (pageY === undefined || height === undefined) {
              return;
            }
            setViewPositionY(pageY + height);
          });
        }
      }, 100);
    }
  }, [mode]);

  useEffect(() => {
    if (mode === 'page') {
      return;
    }
    setTimeout(() => {
      measureView();
    }, 100);
  }, [measureView, mode]);

  useEffect(() => {
    if (mode === 'page') {
      return;
    }
    if (!isKeyboardOpened) {
      return;
    }
    measureView();
  }, [isKeyboardOpened, measureView, mode]);

  const style = useMemo(() => {
    if (!isKeyboardOpened || disable) {
      return undefined;
    }
    const keyboardPositionY = sz.height - keyboardHeight;
    if (viewPositionY <= keyboardPositionY) {
      return undefined;
    }
    const value = viewPositionY - (StatusBar.currentHeight ?? 0) - keyboardPositionY + bottomPad;
    if (mode === 'page') {
      return {
        paddingBottom: value - (gap ?? 0),
        marginTop: -value + (gap ?? 0),
        marginBottom: gap ?? 0,
      };
    }
    return {
      paddingBottom: value,
    };
  }, [isKeyboardOpened, disable, sz.height, keyboardHeight, viewPositionY, bottomPad, mode, gap]);
  return (
    <View ref={viewRef} collapsable={false} style={[style, containerStyle]}>
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
          if (pageY === undefined || height === undefined) {
            return;
          }
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
    if (!isKeyboardOpened) {
      return undefined;
    }
    const keyboardPositionY = screenHeight - keyboardHeight;
    if (viewPositionY <= keyboardPositionY) {
      return undefined;
    }

    return viewPositionY - keyboardPositionY + bottomPad;
  }, [bottomPad, isKeyboardOpened, keyboardHeight, viewPositionY]);

  return {
    ref: viewRef,
    value,
  };
};

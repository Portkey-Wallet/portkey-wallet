import { useEffectOnce } from '@portkey-wallet/hooks';
import { FloatTip, FloatTipProps } from 'components/FloatTip';
import Svg from 'components/Svg';
import React, { useCallback, useRef, useState } from 'react';
import { LayoutChangeEvent, StyleSheet, TouchableOpacity, StyleProp, ViewStyle } from 'react-native';
import { pTd } from 'utils/unit';

export interface CopyButtonProps {
  style?: StyleProp<ViewStyle>;
  tipsStyle?: Pick<FloatTipProps, 'containerStyle' | 'textStyle' | 'content'>;
  onCopy: () => void;
  duration?: number;
}

export const CopyButton = (props: CopyButtonProps) => {
  const [copyChecked, setCopyChecked] = useState(false);
  const copyForwarder = useRef<NodeJS.Timeout | null>(null);
  const { style = {}, tipsStyle = {}, onCopy, duration = 2000 } = props;
  const [wrapperLayoutProps, setWrapperLayoutProps] = useState<{ width: number; height: number }>({
    width: 0,
    height: 0,
  });
  const onLayout = useCallback(
    (event: LayoutChangeEvent) => {
      const { width, height } = event.nativeEvent.layout;
      if (wrapperLayoutProps.width === width && wrapperLayoutProps.height === height) return;
      setWrapperLayoutProps({ width, height });
    },
    [wrapperLayoutProps],
  );
  useEffectOnce(() => {
    return () => {
      if (copyForwarder.current) {
        clearTimeout(copyForwarder.current);
      }
    };
  });

  const copyId = useCallback(() => {
    onCopy();
    setCopyChecked(true);
    copyForwarder.current = setTimeout(() => {
      setCopyChecked(false);
      copyForwarder.current = null;
    }, duration);
  }, [duration, onCopy]);

  return (
    <TouchableOpacity onPress={copyId} onLayout={onLayout} disabled={copyChecked} style={style}>
      <FloatTip wrapperLayoutProps={wrapperLayoutProps} {...tipsStyle} content={'Copied'} display={copyChecked} />
      <Svg icon={copyChecked ? 'copy-checked' : 'copy1'} size={pTd(32)} iconStyle={styles.copyButtonIcon} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  copyButtonIcon: {
    height: pTd(32),
    width: pTd(32),
    borderRadius: pTd(6),
  },
});

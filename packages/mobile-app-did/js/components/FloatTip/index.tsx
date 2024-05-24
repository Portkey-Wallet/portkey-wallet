import { defaultColors } from 'assets/theme';
import { TextM } from 'components/CommonText';
import React, { useCallback, useMemo, useState } from 'react';
import { TextStyle, View, ViewStyle, StyleSheet, LayoutChangeEvent } from 'react-native';
import { pTd } from 'utils/unit';

export interface FloatTipProps {
  display: boolean;
  content: string;
  wrapperLayoutProps: { width: number; height: number };
  // direction?: 'top' | 'bottom' | 'left' | 'right';  // for now only support 'top'
  containerStyle?: ViewStyle;
  arrowStyle?: ViewStyle;
  textStyle?: TextStyle;
}

export const FloatTip = (props: FloatTipProps) => {
  const { display, content, containerStyle, textStyle, arrowStyle, wrapperLayoutProps } = props;
  const targetStyle = display ? defaultStyle : transparentStyle;
  const { container, text, arrow } = targetStyle;
  const [layoutProps, setLayoutProps] = useState({ width: 0, height: 0 });
  const onLayout = useCallback(
    (event: LayoutChangeEvent) => {
      const { width, height } = event.nativeEvent.layout;
      if (width === layoutProps.width && height === layoutProps.height) return;
      setLayoutProps({ width, height });
    },
    [layoutProps.height, layoutProps.width],
  );
  const baseTextStyle: TextStyle = {
    color: defaultColors.white,
    backgroundColor: defaultColors.black,
    fontSize: pTd(12),
    lineHeight: pTd(16),
    paddingHorizontal: pTd(8),
    paddingVertical: pTd(6),
    minWidth: pTd(54),
    borderRadius: pTd(6),
    overflow: 'hidden',
  };
  const baseArrowStyle: ViewStyle = {
    borderLeftWidth: 8,
    borderRightWidth: 8,
    borderTopWidth: 8,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: defaultColors.black,
  };

  const addOnStyle: ViewStyle = useMemo(() => {
    const { width: selfWidth } = layoutProps;
    const { width: wrapperWidth } = wrapperLayoutProps; // since now only support top direction, only width is needed
    let positionStyle: ViewStyle = {};
    const direction = 'top';
    const width = Math.abs(wrapperWidth - selfWidth) / 2;
    switch (direction) {
      case 'top': {
        positionStyle = {
          top: -pTd(56),
          left: -width,
        };
        break;
      }
      default: {
        throw new Error('Invalid direction, still in development, use only "top" for now.');
      }
    }
    return Object.assign({ position: 'absolute' }, positionStyle, targetStyle[direction]);
  }, [layoutProps, targetStyle, wrapperLayoutProps]);
  return (
    <View onLayout={onLayout} style={[containerStyle, container, addOnStyle]}>
      <TextM style={[baseTextStyle, textStyle, text]}>{content}</TextM>
      <View style={[baseArrowStyle, arrow, arrowStyle]} />
    </View>
  );
};

const transparentStyle = StyleSheet.create({
  container: {
    backgroundColor: 'transparent',
    borderWidth: 0,
    position: 'absolute',
    zIndex: 999,
    justifyContent: 'center',
    alignItems: 'center',
  },
  top: {
    flexDirection: 'column',
  },
  bottom: {
    flexDirection: 'column-reverse',
  },
  left: {
    flexDirection: 'row',
  },
  right: {
    flexDirection: 'row-reverse',
  },
  text: {
    color: 'transparent',
    backgroundColor: 'transparent',
  },
  arrow: {
    zIndex: 999,
    borderTopColor: 'transparent',
  },
});

const defaultStyle = StyleSheet.create({
  container: {
    position: 'absolute',
    zIndex: 999,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {},
  top: {
    flexDirection: 'column',
  },
  bottom: {
    flexDirection: 'column-reverse',
  },
  left: {
    flexDirection: 'row',
  },
  right: {
    flexDirection: 'row-reverse',
  },
  arrow: {
    zIndex: 999,
    borderTopColor: defaultColors.black,
  },
});

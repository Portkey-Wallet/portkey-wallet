import { defaultColors } from 'assets/theme';
import React, { useCallback, useMemo, useState } from 'react';
import { TextStyle, View, Text, ViewStyle, StyleSheet, LayoutChangeEvent } from 'react-native';

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
    fontSize: 12,
    lineHeight: 16,
    textAlign: 'center',
  };
  const textWrapStyle: ViewStyle = {
    backgroundColor: display ? defaultColors.black : 'transparent',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
    paddingVertical: 6,
    alignSelf: 'flex-start',
    minWidth: 64,
    overflow: 'visible',
    borderRadius: 6,
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
    const { width: selfWidth, height } = layoutProps;
    const { width: wrapperWidth } = wrapperLayoutProps; // since now only support top direction, only width is needed
    let positionStyle: ViewStyle = {};
    const direction = 'top';
    const width = Math.abs(wrapperWidth - selfWidth) / 2;
    switch (direction) {
      case 'top': {
        positionStyle = {
          top: -height - 4,
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
      <View style={textWrapStyle}>
        <Text style={[baseTextStyle, textStyle, text]}>{content}</Text>
      </View>
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
    flexWrap: 'nowrap',
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
    flexWrap: 'nowrap',
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

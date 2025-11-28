import { defaultColors } from 'assets/theme';
import React, { useCallback, useMemo, useState } from 'react';
import { TextStyle, View, Text, ViewStyle, StyleSheet, LayoutChangeEvent } from 'react-native';
import Touchable from 'components/Touchable';
import Svg, { IconName } from 'components/Svg';
import { pTd } from 'utils/unit';

export interface FloatTipProps {
  icon?: IconName;
  display: boolean;
  content: string;
  wrapperLayoutProps: { width: number; height: number };
  direction?: 'top' | 'bottom'; // for now only support 'top' ｜ 'bottom'
  containerStyle?: ViewStyle;
  arrowStyle?: ViewStyle;
  textStyle?: TextStyle;
  onPress?: () => void;
}

export const FloatTips = (props: FloatTipProps) => {
  const {
    icon,
    display,
    content,
    direction = 'top',
    containerStyle,
    textStyle,
    arrowStyle,
    wrapperLayoutProps,
    onPress,
  } = props;
  const targetStyle = display ? defaultStyle : transparentStyle;
  const { container, text, arrow } = targetStyle;
  const [layoutProps, setLayoutProps] = useState({ width: 0, height: 0 });
  const onLayout = useCallback(
    (event: LayoutChangeEvent) => {
      const { width, height } = event.nativeEvent.layout;
      if (width === layoutProps.width && height === layoutProps.height) {
        return;
      }
      setLayoutProps({ width, height });
    },
    [layoutProps.height, layoutProps.width],
  );
  const baseContainerStyle: ViewStyle = {
    display: display ? 'flex' : 'none',
  };
  const baseTextStyle: TextStyle = {
    color: defaultColors.white,
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
  };
  const textWrapStyle: ViewStyle = {
    backgroundColor: defaultColors.bgBase3,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    alignSelf: 'flex-start',
    minWidth: 64,
    overflow: 'visible',
    borderRadius: 8,
  };
  const baseArrowStyle: ViewStyle = {
    borderLeftWidth: 8,
    borderRightWidth: 8,
    borderTopWidth: 8,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: defaultColors.bgBase3,
  };

  const addOnStyle: ViewStyle = useMemo(() => {
    const { width: selfWidth, height } = layoutProps;
    const { width: wrapperWidth } = wrapperLayoutProps; // since now only support top direction, only width is needed
    let positionStyle: ViewStyle = {};
    const width = Math.abs(wrapperWidth - selfWidth) / 2;
    switch (direction) {
      case 'top': {
        positionStyle = {
          top: -height - 4,
          left: width,
        };
        break;
      }
      case 'bottom': {
        positionStyle = {
          top: 0,
          left: width,
        };
        break;
      }
      default: {
        throw new Error('Invalid direction, still in development, use only "top" for now.');
      }
    }
    return Object.assign({ position: 'absolute' }, positionStyle, targetStyle[direction]);
  }, [direction, layoutProps, targetStyle, wrapperLayoutProps]);
  return (
    <Touchable
      onLayout={onLayout}
      onPress={() => onPress?.()}
      style={[baseContainerStyle, containerStyle, container, addOnStyle]}>
      <View style={textWrapStyle}>
        {icon && <Svg icon={icon} size={pTd(16)} iconStyle={defaultStyle.iconFavorite} />}

        <Text style={[baseTextStyle, textStyle, text]}>{content}</Text>
      </View>
      <View style={[baseArrowStyle, arrow, arrowStyle, direction === 'bottom' ? targetStyle.bottomArrow : {}]} />
    </Touchable>
  );
};

const transparentStyle = StyleSheet.create({
  container: {
    borderWidth: 0,
    position: 'absolute',
    zIndex: 9999,
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
  bottomArrow: {
    transform: [{ rotateX: '180deg' }],
  },
});

const defaultStyle = StyleSheet.create({
  container: {
    position: 'absolute',
    zIndex: 9999,
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'nowrap',
  },
  iconFavorite: {
    marginRight: pTd(10),
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
    borderTopColor: defaultColors.bgBase3,
  },
  bottomArrow: {
    transform: [{ rotateX: '180deg' }],
  },
});

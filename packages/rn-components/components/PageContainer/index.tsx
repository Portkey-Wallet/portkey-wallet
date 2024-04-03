import React, { ReactNode, useMemo } from 'react';
import CustomHeader, { CustomHeaderProps, SafeAreaColorMapKeyUnit } from '../CustomHeader';
import SafeAreaBox, { SafeAreaBoxProps } from '../SafeAreaBox';
import { KeyboardAwareScrollView, KeyboardAwareScrollViewProps } from 'react-native-keyboard-aware-scroll-view';
import { TouchableWithoutFeedback, View, Keyboard, StatusBar } from 'react-native';
import { useGStyles, useTheme } from '../../theme';
import { ViewStyleType } from '../../theme/type';

export default function PageContainer({
  safeAreaColor = ['white', 'white'],
  children,
  safeAreaProps,
  containerStyles,
  scrollViewProps,
  hideHeader,
  hideTouchable,
  pageSafeBottomPadding,
  ...props
}: CustomHeaderProps & {
  safeAreaColor?: SafeAreaColorMapKeyUnit[]; // top and bottom safeArea color
  children?: ReactNode;
  safeAreaProps?: SafeAreaBoxProps[];
  scrollViewProps?: KeyboardAwareScrollViewProps & {
    disabled?: boolean; // disabled scrollView
  };
  containerStyles?: ViewStyleType;
  hideHeader?: boolean;
  hideTouchable?: boolean;
  pageSafeBottomPadding?: boolean;
}) {
  const gStyles = useGStyles();
  const themeType = useMemo(() => safeAreaColor[0], [safeAreaColor]);
  const theme = useTheme();
  const SafeAreaColorMap = {
    white: theme.bg1,
    blue: theme.bg5,
    red: theme.bg17,
    gray: theme.bg4,
    transparent: 'transparent',
  };
  return (
    <SafeAreaBox
      {...safeAreaProps}
      edges={['top', 'right', 'left']}
      style={[{ backgroundColor: SafeAreaColorMap[safeAreaColor[0]] }, safeAreaProps?.[0]?.style]}>
      <SafeAreaBox
        edges={['bottom']}
        pageSafeBottomPadding={pageSafeBottomPadding}
        style={[{ backgroundColor: SafeAreaColorMap[safeAreaColor[1]] }, safeAreaProps?.[1]?.style]}>
        {!hideHeader && <CustomHeader themeType={themeType} {...props} />}
        {themeType === 'white' && <StatusBar barStyle="dark-content" />}
        {scrollViewProps?.disabled ? (
          hideTouchable ? (
            <View style={[gStyles.container, containerStyles]}>{children}</View>
          ) : (
            <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
              <View style={[gStyles.container, containerStyles]}>{children}</View>
            </TouchableWithoutFeedback>
          )
        ) : (
          <KeyboardAwareScrollView
            keyboardOpeningTime={0}
            extraHeight={20}
            // alwaysBounceVertical={false}
            keyboardShouldPersistTaps="handled"
            // enableAutomaticScroll={false}
            enableOnAndroid={true}
            {...scrollViewProps}>
            <View style={[gStyles.container, containerStyles]}>{children}</View>
          </KeyboardAwareScrollView>
        )}
      </SafeAreaBox>
    </SafeAreaBox>
  );
}

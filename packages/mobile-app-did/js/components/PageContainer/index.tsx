import React, { ReactNode, useMemo } from 'react';
import CustomHeader, { CustomHeaderProps } from 'components/CustomHeader';
import SafeAreaBox, { SafeAreaBoxProps } from 'components/SafeAreaBox';
import { useGStyles } from 'assets/theme/useGStyles';
import { KeyboardAwareScrollView, KeyboardAwareScrollViewProps } from 'react-native-keyboard-aware-scroll-view';
import { TouchableWithoutFeedback, View, Keyboard, StatusBar } from 'react-native';
import { defaultColors, darkColors } from 'assets/theme';
import { ViewStyleType } from 'types/styles';

export const SafeAreaColorMap = {
  white: defaultColors.bg1,
  blue: defaultColors.bg5,
  black: darkColors.bgBase1,
  red: defaultColors.bg17,
  gray: defaultColors.bg4,
  transparent: 'transparent',
};

export type SafeAreaColorMapKeyUnit = keyof typeof SafeAreaColorMap;

export default function PageContainer({
  safeAreaColor = ['black', 'black'],
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
        {/* {themeType === 'white' && <StatusBar barStyle="dark-content" />} */}
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

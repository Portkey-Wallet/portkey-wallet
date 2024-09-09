import { defaultColors } from 'assets/theme';
import GStyles from 'assets/theme/GStyles';
import CommonButton, { CommonButtonProps } from 'components/CommonButton';
import React from 'react';
import { StyleProp, StyleSheet, TextStyle, View, ViewStyle } from 'react-native';
import { pTd } from 'utils/unit';

export type ButtonRowProps = {
  buttons?: {
    onPress?: () => void;
    type?: CommonButtonProps['type'];
    title: string;
    loading?: CommonButtonProps['loading'];
    disabled?: boolean;
  }[];
  style?: StyleProp<ViewStyle>;
} & CommonButtonProps;
export default function ButtonCol({
  buttonStyle: propsButtonStyle,
  titleStyle: propsTitleStyle,
  buttons,
  style,
}: ButtonRowProps) {
  return (
    <View style={[styles.buttonsBox, style]}>
      {Array.isArray(buttons) &&
        buttons.map((item, index) => {
          const buttonStyle: StyleProp<ViewStyle> = [styles.buttonStyle];
          const containerStyle: StyleProp<ViewStyle> = [
            styles.containerStyle,
            index === buttons.length - 1 && styles.lastContainerStyle,
          ];
          const titleStyle: StyleProp<TextStyle> = [styles.titleStyle];
          if (item.type === 'outline') {
            buttonStyle.push(styles.outlineButtonStyle);
            titleStyle.push(styles.outlineTitleStyle);
          }

          return (
            <CommonButton
              disabled={item.disabled}
              loading={item.loading}
              loadingProps={item.type === 'outline' ? { color: defaultColors.primaryColor } : undefined}
              containerStyle={containerStyle}
              buttonStyle={[buttonStyle, propsButtonStyle]}
              titleStyle={[titleStyle, propsTitleStyle]}
              onPress={item.onPress}
              type={item.type || 'primary'}
              key={index}
              title={item.title}
            />
          );
        })}
    </View>
  );
}

export const styles = StyleSheet.create({
  buttonStyle: {
    width: '100%',
    height: pTd(40),
    paddingHorizontal: 0,
  },
  outlineButtonStyle: {
    borderWidth: 1,
    borderColor: defaultColors.border1,
  },
  containerStyle: {
    // TODO: change margin
    width: '100%',
    marginBottom: pTd(8),
  },
  lastContainerStyle: {
    marginBottom: 0,
  },
  outlineTitleStyle: {
    color: defaultColors.font5,
  },
  buttonItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRightWidth: 1,
    borderRightColor: defaultColors.border1,
    overflow: 'hidden',
  },
  buttonsBox: {
    marginTop: pTd(20),
  },
  titleStyle: {
    width: '100%',
    fontSize: pTd(14),
  },
});

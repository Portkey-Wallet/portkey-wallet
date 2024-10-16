import { TextProps } from '@rneui/base';
import { defaultColors, darkColors } from 'assets/theme';
import fonts from 'assets/theme/fonts';
import React from 'react';
import { Text, StyleSheet, View } from 'react-native';
import { TextStyleType, ViewStyleType } from 'types/styles';
import { pTd } from 'utils/unit';
const styles = StyleSheet.create({
  TextS: {
    color: darkColors.textBase1,
    fontSize: pTd(12),
  },
  TextM: {
    color: darkColors.textBase1,
    fontSize: pTd(14),
  },
  TextL: {
    color: darkColors.textBase1,
    fontSize: pTd(16),
  },
  TextXL: {
    color: darkColors.textBase1,
    fontSize: pTd(18),
  },
  TextXXL: {
    color: darkColors.textBase1,
    fontSize: pTd(20),
  },
  TextXXXL: {
    color: darkColors.textBase1,
    fontSize: pTd(24),
    ...fonts.mediumFont,
  },
  TextTitle: {
    color: darkColors.textBase1,
    fontSize: pTd(18),
    ...fonts.mediumFont,
  },
  PrimaryText: {
    color: defaultColors.primaryColor,
    fontSize: pTd(16),
  },
} as const);
type CommonText = { [k in keyof typeof styles]: React.FC<TextProps> };
const obj: any = {};

Object.entries(styles).map(([key, value]) => {
  obj[key] = (props: TextProps) => {
    return (
      <Text {...props} style={[value, props.style]}>
        {props.children}
      </Text>
    );
  };
});

export function BreakWordText({
  containerStyle,
  textStyle,
  children,
}: {
  containerStyle?: ViewStyleType;
  textStyle?: TextStyleType;
  children: string;
}) {
  return (
    <View style={[breakWordTextStyles.containerStyle, containerStyle]}>
      {(children || '').split('').map((i, k) => (
        <TextM style={[styles.TextM, textStyle]} key={k}>
          {i}
        </TextM>
      ))}
    </View>
  );
}

const breakWordTextStyles = StyleSheet.create({
  containerStyle: {
    flexWrap: 'wrap',
    flexDirection: 'row',
  },
});

export const { TextS, TextM, TextL, TextXL, TextXXL, TextXXXL, TextTitle, PrimaryText } = obj as CommonText;

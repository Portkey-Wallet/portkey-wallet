import { TextProps } from '@rneui/base';
import { defaultColors } from 'assets/theme';
import fonts from 'assets/theme/fonts';
import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { pTd } from 'utils/unit';
const styles = StyleSheet.create({
  TextS: {
    color: defaultColors.font5,
    fontSize: pTd(12),
  },
  TextM: {
    color: defaultColors.font5,
    fontSize: pTd(14),
  },
  TextL: {
    color: defaultColors.font5,
    fontSize: pTd(16),
  },
  TextXL: {
    color: defaultColors.font5,
    fontSize: pTd(18),
  },
  TextXXL: {
    color: defaultColors.font5,
    fontSize: pTd(20),
  },
  TextXXXL: {
    color: defaultColors.font5,
    fontSize: pTd(24),
    ...fonts.mediumFont,
  },
  TextTitle: {
    color: defaultColors.font5,
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

export const { TextS, TextM, TextL, TextXL, TextXXL, TextXXXL, TextTitle, PrimaryText } = obj as CommonText;

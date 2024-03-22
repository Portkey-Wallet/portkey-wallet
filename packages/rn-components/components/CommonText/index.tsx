import { TextProps } from '@rneui/base';
import React from 'react';
import { Text, StyleSheet, View } from 'react-native';
import { pTd } from '../../utils/unit';
import { ThemeStyleSheet, useTheme } from '../../theme';
import { TextStyleType, Theme, ViewStyleType } from '../../theme/type';
const theme = ThemeStyleSheet.create();
const styles = StyleSheet.create({
  TextS: {
    color: theme.font5,
    fontSize: pTd(12),
  },
  TextM: {
    color: theme.font5,
    fontSize: pTd(14),
  },
  TextL: {
    color: theme.font5,
    fontSize: pTd(16),
  },
  TextXL: {
    color: theme.font5,
    fontSize: pTd(18),
  },
  TextXXL: {
    color: theme.font5,
    fontSize: pTd(20),
  },
  TextXXXL: {
    color: theme.font5,
    fontSize: pTd(24),
    ...theme.mediumFont,
  },
  TextTitle: {
    color: theme.font5,
    fontSize: pTd(18),
    ...theme.mediumFont,
  },
  PrimaryText: {
    color: theme.primaryColor,
    fontSize: pTd(16),
  },
} as const);
const getStyle = (theme: Theme) =>
  StyleSheet.create({
    TextS: {
      color: theme.font5,
      fontSize: pTd(12),
    },
    TextM: {
      color: theme.font5,
      fontSize: pTd(14),
    },
    TextL: {
      color: theme.font5,
      fontSize: pTd(16),
    },
    TextXL: {
      color: theme.font5,
      fontSize: pTd(18),
    },
    TextXXL: {
      color: theme.font5,
      fontSize: pTd(20),
    },
    TextXXXL: {
      color: theme.font5,
      fontSize: pTd(24),
      ...theme.mediumFont,
    },
    TextTitle: {
      color: theme.font5,
      fontSize: pTd(18),
      ...theme.mediumFont,
    },
    PrimaryText: {
      color: theme.primaryColor,
      fontSize: pTd(16),
    },
  } as const);
type CommonText = { [k in keyof typeof styles]: React.FC<TextProps> };
const obj: any = {};

Object.entries(styles).map(([key, value]) => {
  obj[key] = (props: TextProps) => {
    const theme = useTheme();
    const dynamicStyles = getStyle(theme);
    const dynamicValue = dynamicStyles[key as keyof typeof styles];
    return (
      <Text {...props} style={[dynamicValue, props.style]}>
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

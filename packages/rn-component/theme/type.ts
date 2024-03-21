import type { StyleProp, TextStyle, ViewStyle } from 'react-native';
import { defaultTheme } from '.';
import { defaultCss } from './default';

export type ThemeType = typeof defaultTheme;
export type Theme = typeof defaultCss;

export type ViewStyleType = StyleProp<ViewStyle>;
export type TextStyleType = StyleProp<TextStyle>;

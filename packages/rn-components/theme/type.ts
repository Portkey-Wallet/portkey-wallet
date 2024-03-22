import type { StyleProp, TextStyle, ViewStyle } from 'react-native';
import { defaultTheme } from '.';
import { defaultCss } from './default';
type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends (infer U)[]
    ? DeepPartial<U>[]
    : T[P] extends readonly (infer U)[]
    ? readonly DeepPartial<U>[]
    : T[P] extends object
    ? DeepPartial<T[P]>
    : T[P];
};
export type ThemeType = DeepPartial<typeof defaultTheme>;
export type Theme = typeof defaultCss;

export type ViewStyleType = StyleProp<ViewStyle>;
export type TextStyleType = StyleProp<TextStyle>;

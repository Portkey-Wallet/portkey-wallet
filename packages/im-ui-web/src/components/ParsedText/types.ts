import React, { CSSProperties } from 'react';

export interface TypographyProps {
  id?: string;
  prefixCls?: string;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  ['aria-label']?: string;
}
export interface TextProps extends TypographyProps {
  title?: string;
  disabled?: boolean;
  code?: boolean;
  mark?: boolean;
  underline?: boolean;
  delete?: boolean;
  strong?: boolean;
  keyboard?: boolean;
  italic?: boolean;
}

interface BaseParseShape extends Pick<TextProps, Exclude<keyof TextProps, 'onPress' | 'onLongPress'>> {
  /** arbitrary function to rewrite the matched string into something else */
  renderText?: (matchingString: string, matches: string[]) => string;
  onClick?: (text: string, index: number) => void;
  onLongPress?: (text: string, index: number) => void;
}

export interface DefaultParseShape extends BaseParseShape {
  type: 'url' | 'phone' | 'email';
}
export interface CustomParseShape extends BaseParseShape {
  pattern?: string | RegExp;
  nonExhaustiveModeMaxMatchCount?: number;
  style?: CSSProperties;
}

export type ParseShape = DefaultParseShape | CustomParseShape;

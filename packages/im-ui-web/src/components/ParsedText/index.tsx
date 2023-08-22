import React, { useCallback } from 'react';
import TextExtraction from './utils';
import { CustomParseShape, DefaultParseShape, ParseShape, TextProps, TypographyProps } from './types';
import { PATTERNS } from './constants';

export interface ParsedTextProps extends TypographyProps {
  children: string;
  parse?: ParseShape[];
  style?: React.CSSProperties;
  childrenProps?: TextProps;
}

export default function ParsedText(props: ParsedTextProps) {
  const { children, parse, style: parentStyle, childrenProps, ...remainder } = props;
  const getPatterns = useCallback(() => {
    return parse?.map(option => {
      const { type, ...patternOption } = option as DefaultParseShape;
      if (type) {
        if (!PATTERNS[type]) {
          throw new Error(`${type} is not a supported type`);
        }
        (patternOption as CustomParseShape).pattern = PATTERNS[type];
      }
      return patternOption as CustomParseShape;
    });
  }, [parse]);
  const getParsedText = useCallback(() => {
    if (!parse) return children;

    if (typeof children !== 'string') return children;

    const textExtraction = new TextExtraction(children, getPatterns());

    return textExtraction.parse().map((props, index) => {
      const { style, ...remainder } = props as CustomParseShape;
      return (
        <span
          key={`parsedText-${index}`}
          style={{ ...parentStyle, ...style }}
          {...childrenProps}
          {...(remainder as any)}
        />
      );
    });
  }, [children, childrenProps, getPatterns, parentStyle, parse]);

  return (
    <span style={parentStyle} {...remainder}>
      {getParsedText()}
    </span>
  );
}

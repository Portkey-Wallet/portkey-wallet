import React from 'react';
import { Falsy, Text, TouchableWithoutFeedback } from 'react-native';
import { TextStyle } from 'react-native';

const DEFAULT_TEXT_DIVIDER = '$';

export interface IRichTextProps {
  text: string;
  commonTextStyle: TextStyle | Array<TextStyle | Falsy>;
  specialTextStyle?: TextStyle | Array<TextStyle | Falsy>;
  wrapperStyle?: TextStyle | Array<TextStyle | Falsy>;
  links?: Array<ILinkCatcher>;
  textDivider?: string;
  maxLines?: number;
  ellipsizeMode?: 'head' | 'middle' | 'tail' | 'clip';
}

export interface ILinkCatcher {
  linkSyntax: RegExp | string;
  linkPress: () => void;
  linkStyle?: TextStyle;
}

export const RichText: React.FC<IRichTextProps> = ({
  text,
  wrapperStyle,
  commonTextStyle,
  specialTextStyle,
  links,
  textDivider = DEFAULT_TEXT_DIVIDER,
  maxLines,
  ellipsizeMode,
}: IRichTextProps) => {
  const renderText = () => {
    const textArray = text.split(textDivider);
    return textArray.map((part, index) => {
      const isSpecial = index % 2 !== 0;
      const matchedLink = links && getMatchedLinkCatcher(part, links);
      return matchedLink ? (
        <TouchableWithoutFeedback key={index} onPress={matchedLink.linkPress}>
          <Text style={[matchedLink.linkStyle]}>{part}</Text>
        </TouchableWithoutFeedback>
      ) : (
        <Text key={index} style={isSpecial ? specialTextStyle : commonTextStyle}>
          {part}
        </Text>
      );
    });
  };

  return (
    <Text style={wrapperStyle} numberOfLines={maxLines} ellipsizeMode={ellipsizeMode}>
      {renderText()}
    </Text>
  );
};

const getMatchedLinkCatcher = (text: string, links: Array<ILinkCatcher>): ILinkCatcher | Falsy => {
  return links.find(link => {
    if (link.linkSyntax instanceof RegExp) {
      return link.linkSyntax.test(text);
    }
    return text.includes(link.linkSyntax);
  });
};

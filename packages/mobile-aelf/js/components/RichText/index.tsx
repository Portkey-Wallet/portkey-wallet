import React from 'react';
import { Falsy, Text, TouchableWithoutFeedback } from 'react-native';
import { TextStyle } from 'react-native';

const DEFAULT_TEXT_DIVIDER = '$';

export interface IRichTextProps {
  /**
   * Used to render rich text, it should be a string with special text part wrapped by ```textDivider``` to define special text parts.
   */
  text: string;
  /**
   * Define the style of common text part.
   */
  commonTextStyle: TextStyle | Array<TextStyle | Falsy>;
  /**
   * Define the style of special text part.
   *
   * It can be optional if the rich text only contains special link part.
   */
  specialTextStyle?: TextStyle | Array<TextStyle | Falsy>;
  /**
   * Define the style of wrapper.
   */
  wrapperStyle?: TextStyle | Array<TextStyle | Falsy>;
  /**
   * ```links``` field marks the special text part as a link.
   *
   * ```links``` field has more priority than ```specialTextStyle```.
   *
   * It should be an array of ```ILinkCatcher```.
   * @example
   * ```typescript
   * links: [
   *  {
   *   linkSyntax: 'fish',
   *   linkPress: () => console.log('especially salmon!'),
   *   linkStyle: { color: 'blue' },
   *  },
   * ]
   * ...
   * text: 'I love $fish$!'
   * ```
   */
  links?: Array<ILinkCatcher>;
  /**
   * Define the divider of special text part.
   *
   * Default value is '$'.
   */
  textDivider?: string;
  maxLines?: number;
  ellipsizeMode?: 'head' | 'middle' | 'tail' | 'clip';
}

export interface ILinkCatcher {
  linkSyntax: RegExp | string;
  linkPress: () => void;
  linkStyle?: TextStyle;
}

/**
 * RichText component is used to render rich text with special text part.
 *
 * @example common
 * ```typescript
 * <RichText
 *  text="I love $fish$!"
 *  commonTextStyle={{ color: 'black' }}
 *  specialTextStyle={{ color: 'blue' }}
 * />
 * ```
 *
 * @example link
 * ```typescript
 * <RichText
 * text="I love $fish$!"
 * commonTextStyle={{ color: 'black' }}
 * links={[
 *  {
 *    linkSyntax: 'fish',
 *    linkPress: () => console.log('especially salmon!'),
 *    linkStyle: { color: 'blue' },
 *  },
 * ]}
 * />
 * ```
 */
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

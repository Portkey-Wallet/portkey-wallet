import { Message, MessageType, ParsedContent, ParsedImage, ParsedPinSys } from '../types';

const imageMessageParser = (str: string): ParsedImage => {
  str = str.replace(/,/g, ';');
  const result: Record<string, string> = {};
  const pairs = str.split(';');

  pairs.forEach(pair => {
    const [key, value] = pair.split(':');
    result[key] = value;
  });
  return {
    type: result['type'] || '',
    action: result['action'] || '',
    imgUrl: result['p1(Text)'] || '',
    s3Key: result['p2(Text)'] || '',
    thumbImgUrl: result['p3(Text)'],
    thumbS3Key: result['p4(Text)'],
    width: result['p5(Text)'],
    height: result['p6(Text)'],
  };
};

export const messageContentParser = (type: MessageType | null, content: string): ParsedContent => {
  try {
    switch (type) {
      case 'TEXT':
      case 'SYS':
        return content;
      case 'IMAGE':
        return imageMessageParser(content);
      case 'REDPACKAGE-CARD':
      case 'TRANSFER-CARD':
        return JSON.parse(content);
      case 'PIN-SYS':
        const pinSysParsedContent: ParsedPinSys = JSON.parse(content);
        pinSysParsedContent.parsedContent = messageContentParser(
          pinSysParsedContent.messageType,
          pinSysParsedContent.content,
        );
        return pinSysParsedContent;
      default:
        return undefined;
    }
  } catch (error) {
    return undefined;
  }
};

export const messageParser = (message: Message): Message => {
  let quote = message.quote;
  if (quote) {
    quote = messageParser(quote);
  }

  const parsedContent = messageContentParser(message.type, message.content);
  return {
    ...message,
    parsedContent: parsedContent,
    unidentified: parsedContent === undefined,
    quote,
  };
};

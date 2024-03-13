import { Message, ParsedImage } from '../types';

const imageMessageParser = (str: string): ParsedImage => {
  str = str.replaceAll(/,/g, ';');
  const result: Record<string, string> = {};
  const pairs = str.split(';');

  pairs.forEach(pair => {
    const [key, value] = pair.split(':');
    result[key] = value;
  });
  return {
    type: result.type || '',
    action: result.action || '',
    imgUrl: result['p1(Text)'] || '',
    s3Key: result['p2(Text)'] || '',
    thumbImgUrl: result['p3(Text)'],
    thumbS3Key: result['p4(Text)'],
    width: result['p5(Text)'],
    height: result['p6(Text)'],
  };
};

export const messageParser = (message: Message): Message => {
  switch (message.type) {
    case 'TEXT':
      return {
        ...message,
        parsedContent: message.content,
      };
    case 'IMAGE':
      return {
        ...message,
        parsedContent: imageMessageParser(message.content),
      };
    default:
      return {
        ...message,
        unidentified: true,
      };
  }
};

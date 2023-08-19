import { messageParser as relationMessageParser, Message as RelationMessage } from '@relationlabs/im';
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
    type: result['type'] || '',
    action: result['action'] || '',
    imgUrl: result['p1(Text)'] || '',
    s3Key: result['p2(Text)'] || '',
    thumbImgUrl: result['p1(Text)'],
    thumbS3Key: result['p2(Text)'],
    width: result['p5(Text)'],
    height: result['p6(Text)'],
  };
};

export const messageParser = (message: Message): Message => {
  if (message.type === 'IMAGE') {
    const { content } = message;
    return {
      ...message,
      parsedContent: imageMessageParser(content),
    };
  }
  return relationMessageParser(message as RelationMessage) as Message;
};

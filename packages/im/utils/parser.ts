import { messageParser as relationMessageParser, Message as RelationMessage } from '@relationlabs/im';
import { Message } from '../types';

export const messageParser = (message: Message): Message => {
  return relationMessageParser(message as RelationMessage) as Message;
};

import { createContext } from 'react';

const ChatDetailsContext = createContext({
  toRelationId: '',
  isBot: false,
  displayName: '',
});

export default ChatDetailsContext;

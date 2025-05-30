import { useMemo } from 'react';
import ChatP2P from './ChatP2P';
import ChatGroup from './ChatGroup';
import { useLocation } from 'react-router';
import './index.less';

export default function ChatBox() {
  const location = useLocation();
  const isGroup = useMemo(() => location.pathname.includes('chat-box-group'), [location.pathname]);
  return isGroup ? <ChatGroup /> : <ChatP2P />;
}

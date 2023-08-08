import ChatHome from './ChatHome';
import ChatDetails from './ChatDetails';
import ChatCamera from './ChatCamera';
import SearchPeople from './SearchPeople';
import NewChatHome from './NewChatHome';

const stackNav = [
  { name: 'ChatHome', component: ChatHome },
  { name: 'ChatDetails', component: ChatDetails },
  { name: 'ChatCamera', component: ChatCamera },
  { name: 'SearchPeople', component: SearchPeople },
  { name: 'NewChatHome', component: NewChatHome },
] as const;

export default stackNav;

import ChatHome from './ChatHome';
import ChatDetails from './ChatDetails';
import ChatCamera from './ChatCamera';
import SearchPeople from './SearchPeople';
import NewChatHome from './NewChatHome';
import FindMorePeople from './FindMorePeople';

const stackNav = [
  { name: 'ChatHome', component: ChatHome },
  { name: 'ChatDetails', component: ChatDetails },
  { name: 'ChatCamera', component: ChatCamera },
  { name: 'SearchPeople', component: SearchPeople },
  { name: 'NewChatHome', component: NewChatHome },
  { name: 'FindMorePeople', component: FindMorePeople },
] as const;

export default stackNav;

import ChatHome from './ChatHome';
import ChatDetails from './ChatDetails';
import ChatCamera from './ChatCamera';
import SearchPeople from './SearchPeople';
import NewChatHome from './NewChatHome';
import FindMorePeople from './FindMorePeople';
import ChatQrCode from './ChatQrCode';

const stackNav = [
  { name: 'ChatHome', component: ChatHome },
  { name: 'ChatDetails', component: ChatDetails },
  { name: 'ChatCamera', component: ChatCamera },
  { name: 'SearchPeople', component: SearchPeople },
  { name: 'NewChatHome', component: NewChatHome },
  { name: 'FindMorePeople', component: FindMorePeople },
  { name: 'ChatQrCode', component: ChatQrCode },
] as const;

export default stackNav;

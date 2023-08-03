import ChatHome from './ChatHome';
import ChatDetails from './ChatDetails';
import ChatCamera from './ChatCamera';

const stackNav = [
  { name: 'ChatHome', component: ChatHome },
  { name: 'ChatDetails', component: ChatDetails },
  { name: 'ChatCamera', component: ChatCamera },
] as const;

export default stackNav;

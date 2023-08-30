import ChatHomePage from './ChatHomePage';
import ChatDetailsPage from './ChatDetailsPage';
import ChatGroupDetailsPage from './ChatGroupDetailsPage';
import CreateGroupPage from './CreateGroupPage';
import ChatCameraPage from './ChatCameraPage';
import SearchPeoplePage from './SearchPeoplePage';
import NewChatHomePage from './NewChatHomePage';
import FindMorePeoplePage from './FindMorePeoplePage';

const stackNav = [
  { name: 'ChatHomePage', component: ChatHomePage },
  { name: 'ChatDetailsPage', component: ChatDetailsPage },
  { name: 'ChatGroupDetailsPage', component: ChatGroupDetailsPage },
  { name: 'ChatCameraPage', component: ChatCameraPage },
  { name: 'CreateGroupPage', component: CreateGroupPage },
  { name: 'SearchPeoplePage', component: SearchPeoplePage },
  { name: 'NewChatHomePage', component: NewChatHomePage },
  { name: 'FindMorePeoplePage', component: FindMorePeoplePage },
] as const;

export default stackNav;

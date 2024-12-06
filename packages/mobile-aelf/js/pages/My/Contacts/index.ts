import ContactsHome from './ContactsHome';
import ContactEdit from './ContactEdit';
import ContactDetail from './ContactDetail';
import ChatContactProfile from './ChatContactProfile';
import ChatContactProfileEdit from './ChatContactProfileEdit';
import NoChatContactProfile from './NoChatContactProfile';
import NoChatContactProfileEdit from './NoChatContactProfileEdit';

import ContactActivity from './ContactActivity';

const stackNav = [
  { name: 'ContactsHome', component: ContactsHome },
  { name: 'ContactEdit', component: ContactEdit },
  { name: 'ContactDetail', component: ContactDetail },
  { name: 'ContactActivity', component: ContactActivity },
  { name: 'ChatContactProfile', component: ChatContactProfile },
  { name: 'ChatContactProfileEdit', component: ChatContactProfileEdit },
  { name: 'NoChatContactProfile', component: NoChatContactProfile },
  { name: 'NoChatContactProfileEdit', component: NoChatContactProfileEdit },
] as const;

export default stackNav;

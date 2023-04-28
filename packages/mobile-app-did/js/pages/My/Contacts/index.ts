import ContactsHome from './ContactsHome';
import ContactEdit from './ContactEdit';
import ContactDetail from './ContactDetail';

const stackNav = [
  { name: 'ContactsHome', component: ContactsHome },
  { name: 'ContactEdit', component: ContactEdit },
  { name: 'ContactDetail', component: ContactDetail },
] as const;

export default stackNav;

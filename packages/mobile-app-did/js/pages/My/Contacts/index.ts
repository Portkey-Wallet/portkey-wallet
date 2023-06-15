import ContactsHome from './ContactsHome';
import ContactEdit from './ContactEdit';
import ContactDetail from './ContactDetail';
import ContactActivity from './ContactActivity';

const stackNav = [
  { name: 'ContactsHome', component: ContactsHome },
  { name: 'ContactEdit', component: ContactEdit },
  { name: 'ContactDetail', component: ContactDetail },
  { name: 'ContactActivity', component: ContactActivity },
] as const;

export default stackNav;

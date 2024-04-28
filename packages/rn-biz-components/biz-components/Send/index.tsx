import SendHome from './SendHome';
import SendPreview from './SendPreview';
import SelectContact from './SelectContact';

const stackNav = [
  { name: 'SendHome', component: SendHome },
  { name: 'SendPreview', component: SendPreview },
  { name: 'SelectContact', component: SelectContact },
] as const;

export default stackNav;

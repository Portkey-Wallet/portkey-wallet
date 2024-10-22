import SendHome from './SendHome';
import SendPreview from './SendPreview';
import SelectContact from './SelectContact';
import SelectAsset from './SelectAsset';
import SendFinishPage from './SendFinishPage';

const stackNav = [
  { name: 'SendHome', component: SendHome },
  { name: 'SendPreview', component: SendPreview },
  { name: 'SelectContact', component: SelectContact },
  { name: 'SelectAsset', component: SelectAsset },
  { name: 'SendFinishPage', component: SendFinishPage },
] as const;

export default stackNav;

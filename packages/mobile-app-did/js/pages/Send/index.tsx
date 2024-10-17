import SendHome from './SendHome';
import SendPreview from './SendPreview';
import SelectContact from './SelectContact';
import SelectAsset from './SelectAsset';

const stackNav = [
  { name: 'SendHome', component: SendHome },
  { name: 'SendPreview', component: SendPreview },
  { name: 'SelectContact', component: SelectContact },
  { name: 'SelectAsset', component: SelectAsset },
] as const;

export default stackNav;

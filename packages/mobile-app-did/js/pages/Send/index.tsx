import SendHome from './SendHome';
import SendReceivePreview from '../../components/SendReceivePreview';
import SelectContact from './SelectContact';
import SelectAsset from './SelectAsset';
import SendReceiveFinishPage from '../../components/SendReceiveFinishPage';

const stackNav = [
  { name: 'SendHome', component: SendHome },
  { name: 'SendPreview', component: SendReceivePreview },
  { name: 'SelectContact', component: SelectContact },
  { name: 'SelectAsset', component: SelectAsset },
  { name: 'SendFinishPage', component: SendReceiveFinishPage },
] as const;

export default stackNav;

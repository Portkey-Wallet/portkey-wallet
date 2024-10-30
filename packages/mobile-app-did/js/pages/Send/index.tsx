import SendHome from './SendHome';
import SendPreviewPage from './SendPreview';
import SelectContact from './SelectContact';
import SelectAsset from './SelectAsset';
import SendReceiveFinishPage from '../../components/SendReceiveFinishPage';

const stackNav = [
  { name: 'SendHome', component: SendHome },
  { name: 'SendPreview', component: SendPreviewPage },
  { name: 'SelectContact', component: SelectContact },
  { name: 'SelectAsset', component: SelectAsset },
  { name: 'SendFinishPage', component: SendReceiveFinishPage },
] as const;

export default stackNav;

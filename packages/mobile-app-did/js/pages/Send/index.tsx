import SendHome from './SendHome';
import SendPreviewPage from './SendPreview';
import SelectAsset from './SelectAsset';
import CommonFinishPage from '../../components/CommonFinishPage';

const stackNav = [
  { name: 'SendHome', component: SendHome },
  { name: 'SendPreview', component: SendPreviewPage },
  { name: 'SelectAsset', component: SelectAsset },
  { name: 'SendFinishPage', component: CommonFinishPage },
] as const;

export default stackNav;

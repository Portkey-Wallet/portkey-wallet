import SendReceivePreview from 'components/SendReceivePreview';
import Receive from './Receive';
import SelectToken from './SelectToken';
import CommonFinishPage from 'components/CommonFinishPage';

const stackNav = [
  { name: 'Receive', component: Receive },
  { name: 'ReceivePreview', component: SendReceivePreview },
  { name: 'ReceiveSelectToken', component: SelectToken },
  { name: 'ReceiveFinishPage', component: CommonFinishPage },
] as const;

export default stackNav;

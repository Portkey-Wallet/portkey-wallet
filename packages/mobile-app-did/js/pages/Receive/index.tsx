import SendReceivePreview from 'components/SendReceivePreview';
import Receive from './Receive';
import SelectToken from './SelectToken';
import SendReceiveFinishPage from 'components/SendReceiveFinishPage';

const stackNav = [
  { name: 'Receive', component: Receive },
  { name: 'ReceivePreview', component: SendReceivePreview },
  { name: 'ReceiveSelectToken', component: SelectToken },
  { name: 'ReceiveFinishPage', component: SendReceiveFinishPage },
] as const;

export default stackNav;

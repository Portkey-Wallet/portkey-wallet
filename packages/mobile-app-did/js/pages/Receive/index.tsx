import Receive from './ReceiveHome';
import SelectToken from './SelectToken';

const stackNav = [
  { name: 'Receive', component: Receive },
  { name: 'ReceiveSelectToken', component: SelectToken },
] as const;

export default stackNav;

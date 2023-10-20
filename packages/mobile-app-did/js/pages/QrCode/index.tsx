import QrScanner from './QrScanner';
import QrCodeResult from './QrCodeResult';

const stackNav = [
  { name: 'QrScanner', component: QrScanner },
  { name: 'QrCodeResult', component: QrCodeResult },
] as const;

export default stackNav;

import LoginPortkey from './LoginPortkey';
import ScanLogin from './ScanLogin';
import SelectCountry from './SelectCountry';
import PrepareWallet from './PrepareWallet';
import LoginEmail from './LoginEmail';
import SignUpEmail from './SignUpEmail';
import LoginQRCode from './LoginQRCode';

const stackNav = [
  { name: 'LoginEmail', component: LoginEmail },
  { name: 'LoginQRCode', component: LoginQRCode },
  { name: 'SignUpEmail', component: SignUpEmail },
  { name: 'LoginPortkey', component: LoginPortkey },
  { name: 'ScanLogin', component: ScanLogin },
  { name: 'SelectCountry', component: SelectCountry },
  { name: 'PrepareWallet', component: PrepareWallet, options: { gestureEnabled: false } },
] as const;

export default stackNav;
